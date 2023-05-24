import { Component } from '@angular/core';
import { Picture } from "src/app/class/picture";
import { PICTURE_DESCRIPTIONS } from './constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  pictures: Array<Picture> = [];

  constructor() {
    console.log(PICTURE_DESCRIPTIONS);
    PICTURE_DESCRIPTIONS.forEach((value: any) => {
      this.pictures.push(value);
    })
  }
}
