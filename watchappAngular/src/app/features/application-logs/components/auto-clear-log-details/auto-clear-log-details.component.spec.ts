import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoClearLogDetailsComponent } from './auto-clear-log-details.component';

describe('AutoClearLogDetailsComponent', () => {
  let component: AutoClearLogDetailsComponent;
  let fixture: ComponentFixture<AutoClearLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoClearLogDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoClearLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
