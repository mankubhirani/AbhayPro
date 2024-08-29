import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseHealthStatusMainComponent } from './database-health-status-main.component';

describe('DatabaseHealthStatusMainComponent', () => {
  let component: DatabaseHealthStatusMainComponent;
  let fixture: ComponentFixture<DatabaseHealthStatusMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseHealthStatusMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseHealthStatusMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
