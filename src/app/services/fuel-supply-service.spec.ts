import { TestBed } from '@angular/core/testing';

import { FuelSupplyService } from '../fuel-supply-service';

describe('FuelSupplyService', () => {
  let service: FuelSupplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelSupplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
