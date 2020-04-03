import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdvCardComponent } from './idv-card.component';

describe('IdvCardComponent', () => {
  let component: IdvCardComponent;
  let fixture: ComponentFixture<IdvCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdvCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdvCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
