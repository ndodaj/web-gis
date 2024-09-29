import { TestBed } from '@angular/core/testing';

import { LayerControlService } from './layer-control.service';

describe('LayerControlService', () => {
  let service: LayerControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayerControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
