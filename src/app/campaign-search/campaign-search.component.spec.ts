import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSearchComponent } from './campaign-search.component';

describe('CampaignSearchComponent', () => {
  let component: CampaignSearchComponent;
  let fixture: ComponentFixture<CampaignSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
