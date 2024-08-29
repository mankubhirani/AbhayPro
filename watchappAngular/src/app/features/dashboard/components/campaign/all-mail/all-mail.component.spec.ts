import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMailComponent } from './all-mail.component';

describe('AllMailComponent', () => {
  let component: AllMailComponent;
  let fixture: ComponentFixture<AllMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
