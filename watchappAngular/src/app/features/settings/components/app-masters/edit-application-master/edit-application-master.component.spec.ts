import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicationMasterComponent } from './edit-application-master.component';

describe('EditApplicationMasterComponent', () => {
  let component: EditApplicationMasterComponent;
  let fixture: ComponentFixture<EditApplicationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditApplicationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApplicationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
