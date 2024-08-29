import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmsAndTriggersComponent } from './AlarmsAndTriggersComponent';

describe('AlarmsAndTriggersComponent', () => {
  let component: AlarmsAndTriggersComponent;
  let fixture: ComponentFixture<AlarmsAndTriggersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmsAndTriggersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmsAndTriggersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
