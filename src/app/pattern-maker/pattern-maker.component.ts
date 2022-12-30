import { Component } from '@angular/core';
import { ColorProcessorService } from '../color-processor.service';

@Component({
  selector: 'app-pattern-maker',
  templateUrl: './pattern-maker.component.html',
  styleUrls: ['./pattern-maker.component.css']
})
export class PatternMakerComponent {  
  requiredFileType: string[] = ["image/png", "image/jpg", "image/jpeg"];
  showColorPicker: boolean = false;

  colorNumber: number = 5;
  autoColors: number = 0;
  colors: Array<Array<number>> = new Array<Array<number>> ();
  
  fileName: string = "";
  image: any;
  
  colorProcessor: ColorProcessorService = new ColorProcessorService();
  
  constructor() { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileName = file.name;

    if(file) { 
      var canvas: any = document.getElementById('invisible-canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      const image: ImageBitmap = await createImageBitmap(file)

      context.drawImage(image, 0, 0, 300, 300);
      this.image = context.getImageData(0, 0, 300, 300);

      var canvas: any = document.getElementById('canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      context.drawImage(image, 0, 0, 1000, 1000);

      this.pickColors();
    }
  }

  async execute() { 
    var newImageArray: Uint8ClampedArray; 
    if(this.autoColors == 0) newImageArray = this.colorProcessor.processImage(this.image, this.colorNumber);
    else newImageArray = this.colorProcessor.processImage(this.image, this.colorNumber, this.colors);
    
    var newImageData: ImageData = new ImageData(newImageArray, this.image.width, this.image.height);
    var newImageBitmap: ImageBitmap = await createImageBitmap(newImageData);

    var canvas: any = document.getElementById('canvas');
    var context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, 1000, 1000);
    context.drawImage(newImageBitmap, 0, 0, 1000, 1000);
  }

  pickColors() {
    if(this.autoColors == 0 || !this.image) {
      this.showColorPicker = false;
      return;
    }
    
    var uniqueColors = this.colorProcessor.getUniqueColors(this.image);
    this.colors = this.colorProcessor.getImageColors(uniqueColors, this.colorNumber);
    this.showColorPicker = true;
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  draw() {
    for(var i = 0; i < this.colorNumber; i++) {
      var canvas: any = document.getElementById('canvas' + i);
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      var width = canvas.width;
      var height = canvas.height;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(" + this.colors[i][0] + "," + this.colors[i][1] + "," + this.colors[i][2] + ", 1)";
      context.fillRect(0, 0, width, height);
    }
  }
}
