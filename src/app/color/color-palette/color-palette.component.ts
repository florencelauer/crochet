// From https://malcoded.com/posts/angular-color-picker/

import {
  AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild
} from '@angular/core';
import { ColorPickerService } from 'src/app/services/color-picker.service';
import { ColorProcessorService } from "src/app/services/color-processor.service";

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.css']
})
export class ColorPaletteComponent implements AfterViewInit, OnInit {
  @ViewChild('paletteCanvas')
  canvas!: ElementRef<HTMLCanvasElement>

  private ctx!: CanvasRenderingContext2D

  private mousedown: boolean = false;

  public selectedPosition!: { x: number; y: number }
  
  constructor(private colorService: ColorPickerService, private colorProcessor: ColorProcessorService) {}

  ngOnInit(): void {
    this.colorService.hueChangedListener().subscribe(() => {
      this.draw(); 
      this.emitColor(this.selectedPosition.x, this.selectedPosition.y);
    });
    this.colorService.hueAndColorChangedListener().subscribe(() => this.changeSelectedPosition());
  }

  private changeSelectedPosition(): void {
    const splitColor = this.colorService.color.split(',');
    const r = splitColor[0].substring(5) as any as number;
    const g = splitColor[1] as any as number;
    const b = splitColor[2] as any as number;

    var hsv = this.colorProcessor.rgbToHsv(r, g, b);

    var x = hsv[1];
    var y = 1 - hsv[2];

    this.selectedPosition = {x: x * 250, y: y * 250};
    this.draw();
    this.emitColor(this.selectedPosition.x, this.selectedPosition.y);
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.changeSelectedPosition();
    }, 500);
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    this.ctx.fillStyle = this.colorService.hue || 'rgba(255,255,255,1)'
    this.ctx.fillRect(0, 0, width, height)

    const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0)
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)')
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)')

    this.ctx.fillStyle = whiteGrad
    this.ctx.fillRect(0, 0, width, height)

    const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height)
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)')
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)')

    this.ctx.fillStyle = blackGrad
    this.ctx.fillRect(0, 0, width, height)

    if (this.selectedPosition) {
      this.ctx.strokeStyle = 'white'
      this.ctx.fillStyle = 'white'
      this.ctx.beginPath()
      this.ctx.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        10,
        0,
        2 * Math.PI
      )
      this.ctx.lineWidth = 5
      this.ctx.stroke()
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
    this.draw()
    this.emitColor(evt.offsetX, evt.offsetY)
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
      this.draw()
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    this.colorService.color = rgbaColor
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }
}
