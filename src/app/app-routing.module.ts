import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home/home.component";
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';

const routes: Routes = [
  { path: 'pattern-maker', component: PatternMakerComponent },
  { path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }