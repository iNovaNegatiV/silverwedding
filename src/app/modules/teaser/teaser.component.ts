import { Component } from '@angular/core';

@Component({
  selector: 'hero-teaser',
  templateUrl: './teaser.component.html',
  styleUrls: ['./teaser.component.scss']
})
export class TeaserComponent {
  imageLoaded(evt: Event): void {
    let pageElement = (document.querySelector('.page') as HTMLDivElement);
    if(pageElement) {
      pageElement.style.visibility = "visible";
    }
  }
}
