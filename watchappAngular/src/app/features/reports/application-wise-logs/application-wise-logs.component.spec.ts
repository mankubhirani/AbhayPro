import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationWiseLogsComponent } from './application-wise-logs.component';

describe('ApplicationWiseLogsComponent', () => {
  let component: ApplicationWiseLogsComponent;
  let fixture: ComponentFixture<ApplicationWiseLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationWiseLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationWiseLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
