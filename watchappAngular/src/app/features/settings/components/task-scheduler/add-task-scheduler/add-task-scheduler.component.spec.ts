import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskSchedulerComponent } from './add-task-scheduler.component';

describe('AddTaskSchedulerComponent', () => {
  let component: AddTaskSchedulerComponent;
  let fixture: ComponentFixture<AddTaskSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTaskSchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
