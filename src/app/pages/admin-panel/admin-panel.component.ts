import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import { GuestbookEntry } from 'src/app/modules/GuestbookEntry';
import { GuestEntry } from 'src/app/modules/GuestEntry';
import { ApiService } from 'src/app/modules/ApiService';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {

  public loggedIn: boolean = false;
  public guestEntrys: GuestEntry[] = [];
  public guestbookEntrys: GuestbookEntry[] = [];

  constructor(
    private serivce: ApiService
  ) {}

  isVideo(link: string): boolean {
    let extension_splitter = link.split(".");
    let extension = extension_splitter[extension_splitter.length - 1];
    let videoExtensions = ["mp4", "mov", "wmv", "avi"];

    if(videoExtensions.includes(extension)) {
      return true;
    }
    return false;
  }

  async checkPassword() {
    let passwordElement: HTMLInputElement = (<HTMLInputElement>document.querySelector('#user-input'));
    let userInput = passwordElement.value;
    if(await this.serivce.checkPassword(userInput)) {
      alert("Sie haben sich erfolgreich eingeloggt!");
      this.loggedIn = true;
      await this.loadFrontendData();
    } else {
      alert("Falsches Passwort!");
      this.loggedIn = false;
    }
  }

  async loadFrontendData() {
    if(this.loggedIn) {
      let adminData = await this.serivce.grabData();

      // Load GuestEntrys
      adminData.participants.forEach((p: object) => {
        this.guestEntrys.push(new GuestEntry(p));
      });

      // Load GuestbookEntry
      adminData.guestbooks.forEach((g: object) => {
        this.guestbookEntrys.push(new GuestbookEntry(g));
      });
    }
  }
}
