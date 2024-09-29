import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowForwardComponent } from './arrow-forward.component';

describe('ArrowForwardComponent', () => {
  let component: ArrowForwardComponent;
  let fixture: ComponentFixture<ArrowForwardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrowForwardComponent]
    });
    fixture = TestBed.createComponent(ArrowForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
