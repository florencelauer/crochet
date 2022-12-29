import { TestBed } from '@angular/core/testing';

import { ColorProcessorService } from './color-processor.service';

describe('ColorProcessorService', () => {
  let service: ColorProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
