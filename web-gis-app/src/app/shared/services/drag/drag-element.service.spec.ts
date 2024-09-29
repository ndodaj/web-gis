import { TestBed } from '@angular/core/testing';

import { DragElementService } from './drag-element.service';

describe('DragElementService', () => {
  let service: DragElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
