import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLogsMainComponent } from './application-logs-main.component';

describe('ApplicationLogsMainComponent', () => {
  let component: ApplicationLogsMainComponent;
  let fixture: ComponentFixture<ApplicationLogsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationLogsMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationLogsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
