import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampaignsComponent } from './create-campaigns.component';

describe('CreateCampaignsComponent', () => {
  let component: CreateCampaignsComponent;
  let fixture: ComponentFixture<CreateCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCampaignsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
