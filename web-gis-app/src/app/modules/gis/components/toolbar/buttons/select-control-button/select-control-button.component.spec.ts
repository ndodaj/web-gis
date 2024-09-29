import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectControlButtonComponent } from './select-control-button.component';

describe('SelectControlButtonComponent', () => {
  let component: SelectControlButtonComponent;
  let fixture: ComponentFixture<SelectControlButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectControlButtonComponent]
    });
    fixture = TestBed.createComponent(SelectControlButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
