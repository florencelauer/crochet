import { Component, Input } from '@angular/core';
import { Picture } from 'src/app/class/picture';

@Component({
  selector: 'app-picture-card',
  templateUrl: './picture-card.component.html',
  styleUrls: ['./picture-card.component.css']
})
export class PictureCardComponent {
  @Input() picture: Picture = {title: "", description: "", files: [], colspan: 0, rowspan: 0};
}
