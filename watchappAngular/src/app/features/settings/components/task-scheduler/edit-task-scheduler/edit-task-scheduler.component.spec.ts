import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskSchedulerComponent } from './edit-task-scheduler.component';

describe('EditTaskSchedulerComponent', () => {
  let component: EditTaskSchedulerComponent;
  let fixture: ComponentFixture<EditTaskSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTaskSchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
