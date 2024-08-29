import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewImportComponent } from './review-import.component';

describe('ReviewImportComponent', () => {
  let component: ReviewImportComponent;
  let fixture: ComponentFixture<ReviewImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
