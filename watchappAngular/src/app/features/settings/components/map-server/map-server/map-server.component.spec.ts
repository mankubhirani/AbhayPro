import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapServerComponent } from './map-server.component';

describe('MapServerComponent', () => {
  let component: MapServerComponent;
  let fixture: ComponentFixture<MapServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
