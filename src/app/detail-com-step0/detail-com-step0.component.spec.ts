import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComStep0Component } from './detail-com-step0.component';

describe('DetailComStep0Component', () => {
  let component: DetailComStep0Component;
  let fixture: ComponentFixture<DetailComStep0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailComStep0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComStep0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
