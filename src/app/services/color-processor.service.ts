import { Injectable } from '@angular/core';
import kmeans, { Centroids, KMeans } from 'kmeans-ts';

@Injectable({
  providedIn: 'root'
})
export class ColorProcessorService {
  constructor() {}

  rgbToHsv(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
  
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var d = max - min;
    var h = 0;

    if (max != min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
  
      h /= 6;
    }
  
    var s = max == 0 ? 0 : d / max;
    var v = max;

    return [ h, s, v ];
  }

  getUniqueColors(image: ImageData): Array<Array<number>> {
    var uniqueColors: Map<number, number[]> = new Map<number, number[]>();
    for(var height = 0; height < image.height; height++) {
      for(var width = 0; width < image.width; width++) {
        if(image.data[image.height*height*4 + width*4+3]) {
          const r = image.data[image.height*height*4 + width*4];
          const g = image.data[image.height*height*4 + width*4 + 1];
          const b = image.data[image.height*height*4 + width*4 + 2];
          
          if(!uniqueColors.has(r*255*255 + g*255 + b)) uniqueColors.set(r*255*255 + g*255 + b, [r, g, b]);
        }
      }
    }

    var pixels: Array<Array<number>> = new Array<Array<number>>();
    uniqueColors.forEach((value) => {
      pixels.push(value);
    })

    return pixels;
  }

  getImageColors(uniqueColors: Array<Array<number>>, colorNumber: number): Centroids {
    const output: KMeans = kmeans(uniqueColors, colorNumber, "kmeans");
    output.centroids = output.centroids.map((value) => value.map((value) => Math.round(value)));
    return output.centroids;
  }

  getClosestColor(image: ImageData, colorNumber: number, centroids: Centroids) : Uint8ClampedArray {
    var newImage : Uint8ClampedArray = new Uint8ClampedArray(image.data);
    for(var width = 0; width < image.width; width++) {
      for(var height = 0; height < image.height; height++) {
        if(!newImage[image.height*width*4 + height*4+3]) {
          continue;
        }
        
        const r = newImage[image.height*width*4 + height*4];
        const g = newImage[image.height*width*4 + height*4 + 1];
        const b = newImage[image.height*width*4 + height*4 + 2];

        var min = 255*3;
        for(var i = 0; i < colorNumber; i++) {
          const dist = Math.sqrt((r - centroids[i][0])**2 + (g - centroids[i][1])**2 + (b - centroids[i][2])**2);
          if(dist < min) {
            min = dist;
            newImage[image.height*width*4 + height*4] = centroids[i][0];
            newImage[image.height*width*4 + height*4 + 1] = centroids[i][1];
            newImage[image.height*width*4 + height*4 + 2] = centroids[i][2];
          }
        }
      }
    }

    return newImage;
  }

  processImage(image: ImageData, colorNumber: number, colors?: Array<Array<number>>) : Uint8ClampedArray {
    if(!colors) {
      var uniqueColors: Array<Array<number>> = this.getUniqueColors(image);
      const output: KMeans = kmeans(uniqueColors, colorNumber, "kmeans");
      colors = output.centroids;
    }
    return this.getClosestColor(image, colorNumber, colors);
  }
}
