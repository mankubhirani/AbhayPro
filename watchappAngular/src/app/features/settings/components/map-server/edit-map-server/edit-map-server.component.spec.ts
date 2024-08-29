import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMapServerComponent } from './edit-map-server.component';

describe('EditMapServerComponent', () => {
  let component: EditMapServerComponent;
  let fixture: ComponentFixture<EditMapServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMapServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMapServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
