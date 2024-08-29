import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSegmentComponent } from './create-segment.component';

describe('CreateSegmentComponent', () => {
  let component: CreateSegmentComponent;
  let fixture: ComponentFixture<CreateSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
