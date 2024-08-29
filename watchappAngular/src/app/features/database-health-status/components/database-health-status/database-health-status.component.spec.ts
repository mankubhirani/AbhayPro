import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseHealthStatusComponent } from './database-health-status.component';

describe('DatabaseHealthStatusComponent', () => {
  let component: DatabaseHealthStatusComponent;
  let fixture: ComponentFixture<DatabaseHealthStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseHealthStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseHealthStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
