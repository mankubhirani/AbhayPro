import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCheckUpComponent } from './application-check-up.component';

describe('ApplicationCheckUpComponent', () => {
  let component: ApplicationCheckUpComponent;
  let fixture: ComponentFixture<ApplicationCheckUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationCheckUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
