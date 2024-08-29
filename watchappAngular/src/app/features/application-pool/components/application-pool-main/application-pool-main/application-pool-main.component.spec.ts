import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPoolMainComponent } from './application-pool-main.component';

describe('ApplicationPoolMainComponent', () => {
  let component: ApplicationPoolMainComponent;
  let fixture: ComponentFixture<ApplicationPoolMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPoolMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationPoolMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
