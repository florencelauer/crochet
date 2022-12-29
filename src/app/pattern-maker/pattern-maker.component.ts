import { Component } from '@angular/core';
import { ColorProcessorService } from '../color-processor.service';

@Component({
  selector: 'app-pattern-maker',
  templateUrl: './pattern-maker.component.html',
  styleUrls: ['./pattern-maker.component.css']
})
export class PatternMakerComponent {
  requiredFileType: string[] = ["image/png", "image/jpg", "image/jpeg"];
  colorNumber: number = 5;
  colors: Array<number> = new Array<number>();
  
  fileName: string = "";
  image: any;
  
  colorProcessor: ColorProcessorService = new ColorProcessorService();
  
  constructor() { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileName = file.name;

    if(file) { 
      var canvas: any = document.getElementById('canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      const image: ImageBitmap = await createImageBitmap(file)

      context.drawImage(image, 0, 0, 50, 50);
      this.image = context.getImageData(0, 0, 50, 50);
      
      var newImageArray: Uint8ClampedArray = this.colorProcessor.processImage(this.image, this.colorNumber);
      var newImage: ImageData = new ImageData(newImageArray, this.image.width, this.image.height)
      context.putImageData(newImage, 0, 0);
    }
  }
}
