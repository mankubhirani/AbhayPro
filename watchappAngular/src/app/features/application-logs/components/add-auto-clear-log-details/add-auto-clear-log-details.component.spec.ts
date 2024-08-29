import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAutoClearLogDetailsComponent } from './add-auto-clear-log-details.component';

describe('AddAutoClearLogDetailsComponent', () => {
  let component: AddAutoClearLogDetailsComponent;
  let fixture: ComponentFixture<AddAutoClearLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAutoClearLogDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAutoClearLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
