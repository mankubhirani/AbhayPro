import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteMailComponent } from './complete-mail.component';

describe('CompleteMailComponent', () => {
  let component: CompleteMailComponent;
  let fixture: ComponentFixture<CompleteMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
