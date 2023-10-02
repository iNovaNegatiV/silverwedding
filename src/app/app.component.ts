import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'silverwedding';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const page = (<HTMLDivElement>document.querySelector('.page'));
        if(this.router.url == "/gallery") {
          page.style.background = "none";
          page.style.backgroundColor = "rgba(220, 220, 220, 1)";
        } else {
          page.style.background = "none";
          page.style.backgroundColor = "none";
        }
      }
    });
  }
}
