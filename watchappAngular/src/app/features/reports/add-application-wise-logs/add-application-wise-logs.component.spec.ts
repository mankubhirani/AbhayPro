import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationWiseLogsComponent } from './add-application-wise-logs.component';

describe('AddApplicationWiseLogsComponent', () => {
  let component: AddApplicationWiseLogsComponent;
  let fixture: ComponentFixture<AddApplicationWiseLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApplicationWiseLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplicationWiseLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
