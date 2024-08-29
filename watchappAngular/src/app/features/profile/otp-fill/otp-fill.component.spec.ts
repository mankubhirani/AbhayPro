import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpFillComponent } from './otp-fill.component';

describe('OtpFillComponent', () => {
  let component: OtpFillComponent;
  let fixture: ComponentFixture<OtpFillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpFillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
