import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsIndexComponent } from './settings-index.component';

describe('SettingsIndexComponent', () => {
  let component: SettingsIndexComponent;
  let fixture: ComponentFixture<SettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
