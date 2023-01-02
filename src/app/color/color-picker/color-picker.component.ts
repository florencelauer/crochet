// From https://malcoded.com/posts/angular-color-picker/

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent {
    public hue!: string

    constructor(
      public dialogRef: MatDialogRef<ColorPickerComponent>,
      @Inject(MAT_DIALOG_DATA) public color: string) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
}
