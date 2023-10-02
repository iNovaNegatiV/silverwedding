import {Component, Inject, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-participation',
  templateUrl: './participation.component.html',
  styleUrls: ['./participation.component.scss']
})
export class ParticipationComponent implements OnInit {

  api: string;
  domain: string;
  nameInput: HTMLInputElement = null;
  statusInput: HTMLInputElement = null;
  numberInput: HTMLInputElement = null;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private injectedDocument: any,
    private router: Router
  ) {}

  ngOnInit() {
    this.nameInput = (<HTMLInputElement> document.getElementById('name'));
    this.statusInput = (<HTMLInputElement> document.getElementById('status'));
    this.numberInput = (<HTMLInputElement> document.getElementById('number'));
    this.domain = this.injectedDocument.location.hostname;

    if(this.domain == "localhost") {
      this.api = "http://localhost:82/php/connection.php";
    } else {
      this.api = "https://silberfeier-behrens.site/php/connection.php";
    }
  }

  submitForm() {
    if(!this.checkForm()) {
     alert("Bitte füllen Sie alle Textfelder aus!");
      return;
    }

    this.http.post<any>(this.api, {
      'type': 'sw_participation',
      'data': {
        name: this.nameInput.value,
        status: this.statusInput.checked,
        number: this.numberInput.value
      }
    }).subscribe({
      next: data => {
        if(data['status'] == 'ok') {
          alert("Danke für ihre Antwort!\n Sie werden nun zur Startseite zurück geleitet :-)");
          this.router.navigate(['/']);
        } else {
          alert("Hoppla! Da ist etwas schief gelaufen!");
        }
      },
      error: error => {
        alert("Hoppla! Da ist etwas schief gelaufen!");
      }
    });
  }

  checkForm(): boolean {
    let name = this.nameInput.value;
    let number = this.numberInput.value;

    if(name == undefined || name == "" || name == null || name.length <= 1) {
      return false;
    }
    if(number == undefined || number == "" || number == null || number.length <= 0 || Number(number) > 50) {
      return false;
    }
    return true;
  }

  openAdminPanel() {
    this.router.navigate(['/admin-panel'])
  }
}
