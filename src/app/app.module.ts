import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { HammerModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2ImageGalleryModule } from "angular2-image-gallery";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorPaletteComponent } from './color/color-palette/color-palette.component';
import { ColorPickerComponent } from './color/color-picker/color-picker.component';
import { ColorSliderComponent } from './color/color-slider/color-slider.component';
import { HomeComponent } from './home/home/home.component';
import { PictureCardComponent } from './home/picture-card/picture-card.component';
import { PatternMakerComponent } from './pattern-maker/pattern-maker.component';

@NgModule({
  declarations: [
    AppComponent,
    PatternMakerComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    ColorPaletteComponent,
    HomeComponent,
    PictureCardComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    AppRoutingModule,
    Angular2ImageGalleryModule,
    HammerModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
