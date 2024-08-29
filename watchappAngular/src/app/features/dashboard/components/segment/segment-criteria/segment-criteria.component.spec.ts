import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentCriteriaComponent } from './segment-criteria.component';

describe('SegmentCriteriaComponent', () => {
  let component: SegmentCriteriaComponent;
  let fixture: ComponentFixture<SegmentCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentCriteriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
