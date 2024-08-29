import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnSubscribeContactsComponent } from './un-subscribe-contacts.component';

describe('UnSubscribeContactsComponent', () => {
  let component: UnSubscribeContactsComponent;
  let fixture: ComponentFixture<UnSubscribeContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnSubscribeContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnSubscribeContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
