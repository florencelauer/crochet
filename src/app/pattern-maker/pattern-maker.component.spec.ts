import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternMakerComponent } from './pattern-maker.component';

describe('PatternMakerComponent', () => {
  let component: PatternMakerComponent;
  let fixture: ComponentFixture<PatternMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternMakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
