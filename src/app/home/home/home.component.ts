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
    PICTURE_DESCRIPTIONS.forEach((value: any, index) => {
      let images: Array<{width: number, height: number}> = [];
      value.files.forEach((file: string) => {
        const Img = new Image();
        Img.src = `assets/images/toutou/${file}`;
        
        Img.onload = (e: any) => {
          const height = e.srcElement.height;
          const width = e.srcElement.width;    
          images.push({width, height});
        }
      });

      this.pictures.push({title: value.title, description: value.description, files: value.files, dimensions: images});
    })
  }
}
