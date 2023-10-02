import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FoodComponent } from './pages/food/food.component';
import { DrinksComponent } from './pages/drinks/drinks.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import {ParticipationComponent} from "./pages/participation/participation.component";
import {AdminPanelComponent} from "./pages/admin-panel/admin-panel.component";
import {GuestbookComponent} from "./pages/guestbook/guestbook.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'speisen', component: FoodComponent},
  {path: 'getraenke', component: DrinksComponent},
  {path: 'gallery', component: GalleryComponent},
  {path: 'participation', component: ParticipationComponent},
  {path: 'guestbook', component: GuestbookComponent},
  {path: 'gallery', component: GalleryComponent},
  {path: 'admin-panel', component: AdminPanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
