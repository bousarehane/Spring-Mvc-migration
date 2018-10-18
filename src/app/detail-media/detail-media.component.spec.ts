import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMediaComponent } from './detail-media.component';

describe('DetailMediaComponent', () => {
  let component: DetailMediaComponent;
  let fixture: ComponentFixture<DetailMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
