// From https://malcoded.com/posts/angular-color-picker/

import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorPickerService } from 'src/app/color-picker.service';

export interface DialogData {
  color: string;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent {
    hexColorFormControl: FormControl = new FormControl('', [Validators.pattern(/^([a-fA-F0-9]{6})$/)]);
    hexColor!: string;
    
    constructor(
      public dialogRef: MatDialogRef<ColorPickerComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      public colorService: ColorPickerService) {
        this.colorService.hueHex = this.getHue();
        this.colorService.color = this.data.color;
        this.rgbToHex();
      }
  
    ngOnInit(): void {
        this.colorService.colorChangedListener().subscribe(() => this.rgbToHex());
    }
      
    onNoClick(): void {
      this.dialogRef.close();
    }

    getHue(): number {
      if(!this.colorService.color) {
        this.colorService.color = this.data.color;
      }

      var splitColor = this.colorService.color.split(',', 3);
      
      var r = splitColor[0].substring(5) as any as number / 255;
      var g = splitColor[1] as any as number / 255;
      var b = splitColor[2] as any as number / 255;
      
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h: number = 0;
      
      if(max == min)
        return 0;
        
      switch(max) {
        case r:
          h = (g-b)/(max-min) + (g < b ? 6 : 0);
          break;
        case g: 
          h = 2.0 + (b-r)/(max-min)
          break;
        case b:
          h = 4.0 + (r-g)/(max-min)
          break;
      }

      h = h * 60;
      console.log(h);
      return h;
    }

    rgbToHex() {
      var splitColor = this.colorService.color.split(',', 4);
      var r: number = splitColor[0].substring(5) as any as number;
      var g: number = splitColor[1] as any as number;
      var b: number = splitColor[2] as any as number;

      var r_hex = Math.round(r).toString(16).toUpperCase().padStart(2, '0');
      var g_hex = Math.round(g).toString(16).toUpperCase().padStart(2, '0');
      var b_hex = Math.round(b).toString(16).toUpperCase().padStart(2, '0');
      this.hexColor = `${r_hex}${g_hex}${b_hex}`;
    }

    hexToRgb() {
      var r: number = Number(`0x${this.hexColor.substring(0, 2)}`);
      var g: number = Number(`0x${this.hexColor.substring(2, 4)}`);
      var b: number = Number(`0x${this.hexColor.substring(4, 6)}`);
      this.colorService.color = `rgba(${r},${g},${b},1)`;
      this.colorService.hueHex = Number(this.getHue());
    }
}
