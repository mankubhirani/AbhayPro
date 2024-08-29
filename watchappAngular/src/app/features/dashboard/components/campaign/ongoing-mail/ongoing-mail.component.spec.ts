import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingMailComponent } from './ongoing-mail.component';

describe('OngoingMailComponent', () => {
  let component: OngoingMailComponent;
  let fixture: ComponentFixture<OngoingMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
