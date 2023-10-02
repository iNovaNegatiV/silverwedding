import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent implements OnInit {

  api: string;
  domain: string;
  progressValue: number = 0;
  progressString: string = this.progressValue + "%";
  error_msg: string = "Unknown error!";

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private injectedDocument: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.domain = this.injectedDocument.location.hostname;
    if(this.domain == "localhost") {
      this.api = "http://localhost:82/php/connection.php";
    } else {
      this.api = "https://silberfeier-behrens.site/php/connection.php";
    }
  }

  hashString(s: string): string {
    let hash = crypto.MD5(s);
    return hash.toString();
  }

  getRandomFileName() {
    let timestamp = new Date().toISOString().replace(/[-:.]/g,"");
    let random = ("" + Math.random()).substring(2, 8);
    return timestamp+random;
  }

  fitsConditions(hasFile: boolean): boolean {
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    let bodytext = (<HTMLTextAreaElement>document.getElementById('bodytext')).value;
    if(name == null || name == "" || bodytext == null || bodytext == "") {
      this.error_msg = "Bitte füllen Sie alle Pflichtfelder aus!";
      return false;
    }

    if(!hasFile) {
      this.error_msg = "Bitte laden Sie ein passendes Bild hoch!";
      return false;
    }

    if(hasFile) {
      let allowedFiletypes = ["jpg","png","jpeg", "gif", "tiff", "webp", "mp4", "mov", "webm", "wmv", "avi"];
      let f = (<HTMLInputElement>document.getElementById('file')).files[0];
      let fileType = f.type.replace(/(.*)\//g, '');
      if(!allowedFiletypes.includes(fileType)) {
        this.error_msg = "Bitte geben Sie nur Dateien der folgenden Typen an: ";
        allowedFiletypes.forEach(t => {
          this.error_msg += "'" + t + "' ";
        });
        return false;
      }
    }
    return true;
  }

  addGuestbookEntry(): void {

    // Get input elements
    let fileElement = (<HTMLInputElement>document.getElementById('file'));
    let hasFile = false;

    // Upload image if working then upload db content
    if(fileElement.files.length > 0) {
      hasFile = true;
    }

    if(!this.fitsConditions(hasFile)) {
      alert(this.error_msg);
      return;
    }

    // Disable button
    (<HTMLDivElement>document.querySelector('.user-input-wrapper')).style.display = "none";
    document.getElementById('submit').style.display = "none";
    document.querySelector('.legal-text > p').innerHTML = "Ihre Daten werden hochgeladen...";

    // Upload image if working then upload db content
    let myFile = fileElement.files[0];
    this.uploadFile(myFile);
  }

  uploadFile(f: File): void {
    // Image/Video data related
    let form_data = new FormData();
    let fileType = f.type.replace(/(.*)\//g, '');
    let newFilename = this.getRandomFileName() + "." + fileType;

    form_data.append("file", f, newFilename);
    form_data.append("folder", "guestbook");

    // Post data to server
    this.http.post<any>(this.api, form_data, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(resp => {
        if (resp.type === HttpEventType.Response) {
          document.querySelector('.status-wrapper').classList.add('show-status');
          document.querySelector('.legal-text > p').innerHTML = "Vielen Dank! Sie werden gleich zur Startseite zurückgeleitet!";
          this.uploadText(true, "/assets/guestbook/" + newFilename);
        }

        if (resp.type === HttpEventType.UploadProgress) {
          this.progressValue = Math.round(100 * resp.loaded / resp.total);
          this.progressString = this.progressValue + "%";
        }
      },
      error => {}
    );
  }

  uploadText(hasFile: boolean, filepath: string): void {
    let nameElement = (<HTMLInputElement>document.getElementById('name'));
    let bodytextElement = (<HTMLTextAreaElement>document.getElementById('bodytext'));

    this.http.post(this.api, {
      type: "sw_guestbook",
      data: {
        name: nameElement.value,
        bodytext: bodytextElement.value,
        file: hasFile,
        filepath: filepath,
      }
    }).subscribe({
      next: data => {},
      error: error => {}
    });

    setTimeout(() => {
      this.router.navigate(['/'])
    }, 1000);
  }
}
