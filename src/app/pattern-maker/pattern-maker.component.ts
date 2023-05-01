import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerComponent } from 'src/app/color/color-picker/color-picker.component';
import { ColorProcessorService } from 'src/app/services/color-processor.service';

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
  originalImage!: ImageBitmap;
  image: any;
  
  colorProcessor: ColorProcessorService = new ColorProcessorService();
  
  constructor(public dialog: MatDialog) { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileName = file.name;

    if(file) { 
      this.originalImage = await createImageBitmap(file)
      
      // canvas showing the grid
      var gridCanvas: any = document.getElementById('grid-canvas');
      gridCanvas.width = this.originalImage.width * gridCanvas.height / this.originalImage.height;
      var gridContext: CanvasRenderingContext2D = gridCanvas.getContext('2d');
      gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

      // invisible canvas containing image to process at the right proportions
      var canvas: any = document.getElementById('invisible-canvas');
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      context.imageSmoothingEnabled = false
      context.drawImage(this.originalImage, 0, 0, this.imgWidth, this.imgHeight);
      this.image = context.getImageData(0, 0, this.imgWidth, this.imgHeight);

      // canvas showing the result
      var canvas: any = document.getElementById('canvas');
      canvas.width = this.originalImage.width * canvas.height / this.originalImage.height;
      var context: CanvasRenderingContext2D = canvas.getContext('2d');
      context.imageSmoothingEnabled = false
      context.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);

      this.pickColors();
    }
  }

  getImageData() {
    var canvas: any = document.getElementById('invisible-canvas');
    var context: CanvasRenderingContext2D = canvas.getContext('2d');

    context.drawImage(this.originalImage, 0, 0, this.imgWidth, this.imgHeight);
    this.image = context.getImageData(0, 0, this.imgWidth, this.imgHeight);
  }

  async execute() { 
    var newImageArray: Uint8ClampedArray = this.colorProcessor.processImage(this.image, this.colorNumber, this.colors);
    
    var newImageData: ImageData = new ImageData(newImageArray, this.image.width, this.image.height);
    var newImageBitmap: ImageBitmap = await createImageBitmap(newImageData);

    var canvas: any = document.getElementById('canvas');
    var context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(newImageBitmap, 0, 0, canvas.width, canvas.height);
    
    this.drawGrid();
  }

  sortByHue(a: number[], b: number[]) {
    let rgbA = this.colorProcessor.rgbToHsv(a[0], a[1], a[2]);
    let rgbB = this.colorProcessor.rgbToHsv(b[0], b[1], b[2]);
    return rgbA[0] >= rgbB[0] ? 1 : 0;
  }

  pickColors() {    
    var uniqueColors = this.colorProcessor.getUniqueColors(this.image);
    var colors = this.colorProcessor.getImageColors(uniqueColors, this.colorNumber);
    this.colors = colors.sort((a, b) => this.sortByHue(a, b))
    
    this.showColorPicker = true;

    setTimeout(()=>{ // wait a tick in order to get the element of block
      for(var i = 0; i < this.colorNumber; i++) {
        this.setColor(i);
      }
    });
  }

  addColor() {
    if(!this.image) return;

    if(this.colorNumber <= this.colors.length) {
      this.colors = this.colors.slice(0, this.colorNumber);

    } else {
      var uniqueColors = this.colorProcessor.getUniqueColors(this.image);
      var colors = this.colorProcessor.getImageColors(uniqueColors, this.colorNumber);  
      this.colors = this.colors.concat(colors.slice(0, this.colorNumber - this.colors.length));
    }

    setTimeout(()=>{ // wait a tick in order to get the element of block
      for(var i = 0; i < this.colorNumber; i++) {
        this.setColor(i);
      }
    });
  }

  trackByFn(index: any) {
    return index;
  }

  setColor(i: number) {
    var colorSampleDiv = document.getElementById('colorSample' + i);
    if(colorSampleDiv) {
      colorSampleDiv.style.fill = "rgba(" + this.colors[i][0] + "," + this.colors[i][1] + "," + this.colors[i][2] + ", 1)";
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
    for (let i = 0; i < canvas.height; i += canvas.height / this.imgHeight) {
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
    }

    // draw col
    for (let j = 0; j < canvas.width; j += canvas.width / this.imgWidth) {
        context.moveTo(j, 0);
        context.lineTo(j, canvas.height);
    }
    
    context.stroke();
  }
}
