import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapServerComponent } from './add-map-server.component';

describe('AddMapServerComponent', () => {
  let component: AddMapServerComponent;
  let fixture: ComponentFixture<AddMapServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMapServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMapServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
