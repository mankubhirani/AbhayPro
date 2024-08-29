import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationCheckUpMainComponent } from './application-check-up-main.component';

describe('ApplicationCheckUpMainComponent', () => {
  let component: ApplicationCheckUpMainComponent;
  let fixture: ComponentFixture<ApplicationCheckUpMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationCheckUpMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationCheckUpMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
