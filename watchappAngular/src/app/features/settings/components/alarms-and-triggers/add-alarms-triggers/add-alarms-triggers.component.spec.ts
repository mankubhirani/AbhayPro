import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlarmsTriggersComponent } from './add-alarms-triggers.component';

describe('AddAlarmsTriggersComponent', () => {
  let component: AddAlarmsTriggersComponent;
  let fixture: ComponentFixture<AddAlarmsTriggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAlarmsTriggersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAlarmsTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
