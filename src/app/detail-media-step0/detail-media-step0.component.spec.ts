import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMediaStep0Component } from './detail-media-step0.component';

describe('DetailMediaStep0Component', () => {
  let component: DetailMediaStep0Component;
  let fixture: ComponentFixture<DetailMediaStep0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMediaStep0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMediaStep0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
