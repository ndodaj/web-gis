import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomInComponent } from './zoom-in.component';

describe('ZoomInComponent', () => {
  let component: ZoomInComponent;
  let fixture: ComponentFixture<ZoomInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomInComponent]
    });
    fixture = TestBed.createComponent(ZoomInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
