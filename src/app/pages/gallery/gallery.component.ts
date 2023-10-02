import {HttpEventType} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ApiService } from 'src/app/modules/ApiService';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  progressValue: number = 0;
  progressString: string = this.progressValue + "%";
  error_msg: string = "Unknown error!";
  images: any = [];

  constructor(
    private service: ApiService
  ) {}

  async ngOnInit() {
    // Reload Images
    await this.reloadImages();
  }

  isVideo(link: string): boolean {
    let extension_splitter = link.split(".");
    let extension = extension_splitter[extension_splitter.length - 1];
    let videoExtensions = ["mp4", "mov", "wmv", "avi", "gif", "mkv"];
    if(videoExtensions.includes(extension)) {
      return true;
    }
    return false;
  }

  async reloadImages() {
    // Reset File value
    (<HTMLInputElement>document.getElementById('file')).value = null;

    // Get images from api service
    let imageData = await this.service.grabImages();

    // Set default values and new images
    this.images = imageData['images'];
    this.progressValue = 0;
    this.progressString = this.progressValue + "%";
  }

  getRandomFileName() {
    let timestamp = new Date().toISOString().replace(/[-:.]/g,"");
    let random = ("" + Math.random()).substring(2, 8);
    return timestamp+random;
  }

  fitsConditions(): boolean {
    let fileElement = (<HTMLInputElement>document.getElementById('file'));

    if(fileElement.files.length <= 0) {
      this.error_msg = "Bitte geben Sie ein passendes Bild an!";
      return false;
    }

    let allowedFiletypes = ["jpg", "png", "jpeg", "gif", "tiff", "webp", "mp4", "mov", "webm", "wmv", "avi", "mkv"];
    let myFile = fileElement.files[0].name;
    let fileSplitter = myFile.split('.');
    let fileType = fileSplitter[fileSplitter.length - 1];
    if(!allowedFiletypes.includes(fileType)) {
      this.error_msg = "Bitte geben Sie nur Dateien der folgenden Typen an: ";
      allowedFiletypes.forEach(t => {
        this.error_msg += "'" + t + "' ";
      });
      return false;
    }
    return true;
  }

  uploadFile() {
    // Checking if conditions fit
    if(!this.fitsConditions()) {
      alert(this.error_msg);
      return;
    }

    // Show current progress
    let uploadElement = (<HTMLDivElement>document.querySelector('.upload-status'));
    uploadElement.style.display = "block";

    // Get FileElement values after verifying existence
    let fileElement = (<HTMLInputElement>document.getElementById('file'));
    let myFile = fileElement.files[0];
    let fileType = myFile.type.replace(/(.*)\//g, '');
    let newFilename = this.getRandomFileName() + "." + fileType;

    // Create new FormData
    let form_data: FormData = new FormData();
    form_data.append("file", myFile, newFilename);
    form_data.append("folder", "gallery");

    // Post data to PHP
    this.service.initUploadProcess(form_data).subscribe(resp => {
        if (resp.type === HttpEventType.Response) {
          alert("Ihre Datei wurde erfolgreich hochgeladen!");
          uploadElement.style.display = "none";

          // Reload Images
          this.reloadImages();
        }

        if (resp.type === HttpEventType.UploadProgress) {
          this.progressValue = Math.round(100 * resp.loaded / resp.total);
          this.progressString = this.progressValue + "%";
        }

        if(resp.type === 4) {
          if(resp.body['status'] == 'ok') {
            if(resp.body['success'] == 1) {
              if(!resp.body['valid_ext']) {
                alert("Ihre Datei hat kein valides Format!");
                uploadElement.style.display = "none";
                return;
              }
              return;
            } else {
              alert("Ihre Datei konnte nicht hochgeladen werden!");
              uploadElement.style.display = "none";
            }
          }
        }
      },
      error => {});
  }

}
