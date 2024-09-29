import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessurementComponent } from './messurement.component';

describe('MessurementComponent', () => {
  let component: MessurementComponent;
  let fixture: ComponentFixture<MessurementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessurementComponent]
    });
    fixture = TestBed.createComponent(MessurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
