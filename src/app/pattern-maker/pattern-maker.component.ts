import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorProcessorService } from '../color-processor.service';
import { ColorPickerComponent } from '../color/color-picker/color-picker.component';

@Component({
  selector: 'app-pattern-maker',
  templateUrl: './pattern-maker.component.html',
  styleUrls: ['./pattern-maker.component.css']
})
export class PatternMakerComponent {  
  requiredFileType: string[] = ["image/png", "image/jpg", "image/jpeg"];
  showColorPicker: boolean = false;

  colorNumber: number = 5;
  imgWidth: number = 120;
  imgHeight: number = 120;
  autoColors: number = 0;
  @Input() colors: Array<Array<number>> = new Array<Array<number>> ();
  
  fileName: string = "";
  image: any;
  
  colorProcessor: ColorProcessorService = new ColorProcessorService();
  
  gridSize:number = 0;

  constructor(public dialog: MatDialog) { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileName = file.name;

    if(file) { 
      var gridCanvas: any = document.getElementById('grid-canvas');
      var gridContext: CanvasRenderingContext2D = gridCanvas.getContext('2d');
      gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

      var canvas: any = document.getElementById('invisible-canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      const image: ImageBitmap = await createImageBitmap(file)

      context.drawImage(image, 0, 0, this.imgWidth, this.imgHeight);
      this.image = context.getImageData(0, 0, this.imgWidth, this.imgHeight);

      var canvas: any = document.getElementById('canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      this.gridSize = canvas.width/this.imgWidth;

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
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(newImageBitmap, 0, 0, canvas.width, canvas.height);
    
    this.drawGrid();
  }

  pickColors() {
    if(this.autoColors == 0 || !this.image) {
      this.showColorPicker = false;
      return;
    }
    
    var uniqueColors = this.colorProcessor.getUniqueColors(this.image);
    this.colors = this.colorProcessor.getImageColors(uniqueColors, this.colorNumber);
    this.showColorPicker = true;

    setTimeout(()=>{ // wait a tick in order to get the element of block
      for(var i = 0; i < this.colorNumber; i++) {
        this.setColor(i);
      }
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  setColor(i: number) {
    var colorSampleDiv = document.getElementById('colorSample' + i);
    if(colorSampleDiv) {
      colorSampleDiv.style.backgroundColor = "rgba(" + this.colors[i][0] + "," + this.colors[i][1] + "," + this.colors[i][2] + ", 1)";
    }
  }

  openDialog(i: number): void { 
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      data: {color: "rgba(" + this.colors[i][0] + "," + this.colors[i][1] + "," + this.colors[i][2] + ", 1)"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      
      var resultStr: string = result as string;
      var splitStr = resultStr.split(',', 3);
      this.colors[i][0] = splitStr[0].substring(5) as any as number;
      this.colors[i][1] = splitStr[1] as any as number;
      this.colors[i][2] = splitStr[2] as any as number;
      this.setColor(i);
    });
  }

  drawGrid() {
    var canvas: any = document.getElementById('grid-canvas');
    var context: CanvasRenderingContext2D = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = `hsla(0, 0%, 0%, 1)`;
    context.lineCap = 'round';
    context.lineWidth = 1;
    context.beginPath();

    // draw row
    for (let i = 0; i < canvas.height; i += this.gridSize) {
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
    }

    // draw col
    for (let j = 0; j < canvas.width; j += this.gridSize) {
        context.moveTo(j, 0);
        context.lineTo(j, canvas.height);
    }
    
    context.stroke();
  }
}
