import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NavigationComponent } from './modules/navigation/navigation.component';
import { FoodComponent } from './pages/food/food.component';
import { DrinksComponent } from './pages/drinks/drinks.component';
import { TeaserComponent } from './modules/teaser/teaser.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { ParticipationComponent } from "./pages/participation/participation.component";
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { HashLocationStrategy, LocationStrategy} from "@angular/common";
import { GuestbookComponent } from './pages/guestbook/guestbook.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ApiService } from './modules/ApiService';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    FoodComponent,
    DrinksComponent,
    TeaserComponent,
    GalleryComponent,
    ParticipationComponent,
    AdminPanelComponent,
    GuestbookComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
