import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSchedulerDetailsComponent } from './task-scheduler-details.component';

describe('TaskSchedulerDetailsComponent', () => {
  let component: TaskSchedulerDetailsComponent;
  let fixture: ComponentFixture<TaskSchedulerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSchedulerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSchedulerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
