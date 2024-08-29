import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlarmsTriggersComponent } from './edit-alarms-triggers.component';

describe('EditAlarmsTriggersComponent', () => {
  let component: EditAlarmsTriggersComponent;
  let fixture: ComponentFixture<EditAlarmsTriggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAlarmsTriggersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAlarmsTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
