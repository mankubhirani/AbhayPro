import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationMasterComponent } from './add-application-master.component';

describe('AddApplicationMasterComponent', () => {
  let component: AddApplicationMasterComponent;
  let fixture: ComponentFixture<AddApplicationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApplicationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplicationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
