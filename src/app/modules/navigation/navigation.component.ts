import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        let counter = 0;
        let routerLinks = document.querySelectorAll('.rt-link');
        let routerImages = document.querySelectorAll('.rt-link + img');
        routerLinks.forEach(e => {
          if(e.getAttribute('routerLink') == this.router.url) {
            routerImages[counter].classList.add('active-route');
            document.querySelector('.current-page-headline').innerHTML = e.innerHTML;
          } else if(this.router.url == "/admin-panel") {
            routerImages[counter].classList.remove('active-route');
            document.querySelector('.current-page-headline').innerHTML = "Administration";
          } else {
            routerImages[counter].classList.remove('active-route');
          }
          counter++;
        });
      }
    });
  }
  toggleNavigation(hasDelay: boolean) {

    let delay: number = 0;
    if(hasDelay) {
      delay = 200;
    }

    setTimeout(() => {
      document.querySelector('.nav-content').classList.toggle('open');
      document.querySelector('.closing-screen').classList.toggle('closed');
    }, delay);
  }
}
