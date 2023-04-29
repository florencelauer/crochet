import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  private colorChanged: Subject<null> = new Subject<null>();
  public currentColor!: string;

  set color(h: string) {
    this.currentColor = h;
    this.emitColorChanged();
  }

  get color() {
    return this.currentColor;
  }
  
  private hueAndColorChanged: Subject<null> = new Subject<null>();
  private hueChanged: Subject<null> = new Subject<null>();
  public currentHue!: string;

  private hueHexChanged: Subject<null> = new Subject<null>();
  public currentHueHex!: number;

  set hue(h: string) {
    this.currentHue = h;
    this.emitHueChanged();
  }

  set hueB(h: string) {
    this.currentHue = h;
    this.emitHueAndColorChanged();
  }

  get hue() {
    return this.currentHue;
  }

  set hueHex(h: number) {
    this.currentHueHex = h;
    this.emitHueHexChanged();
  }

  get hueHex() {
    return this.currentHueHex;
  }

  constructor() { }

  emitHueChanged(): void {
    this.hueChanged.next(null);
  }

  emitHueAndColorChanged(): void {
    this.hueAndColorChanged.next(null);
  }

  emitHueHexChanged(): void {
    this.hueHexChanged.next(null);
  }

  emitColorChanged(): void {
    this.colorChanged.next(null);
  }

  hueChangedListener(): Observable<null> {
    return this.hueChanged.asObservable();
  }

  hueAndColorChangedListener(): Observable<null> {
    return this.hueAndColorChanged.asObservable();
  }

  hueHexChangedListener(): Observable<null> {
    return this.hueHexChanged.asObservable();
  }

  colorChangedListener(): Observable<null> {
    return this.colorChanged.asObservable();
  }
}
