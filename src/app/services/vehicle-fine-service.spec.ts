import { TestBed } from '@angular/core/testing';

import { VehicleFineService } from './vehicle-fine-service';

describe('VehicleFineService', () => {
  let service: VehicleFineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleFineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
