import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSchedulerMainComponent } from './task-scheduler-main.component';

describe('TaskSchedulerMainComponent', () => {
  let component: TaskSchedulerMainComponent;
  let fixture: ComponentFixture<TaskSchedulerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSchedulerMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSchedulerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
