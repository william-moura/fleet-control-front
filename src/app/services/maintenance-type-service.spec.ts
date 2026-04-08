import { TestBed } from '@angular/core/testing';

import { MaintenanceTypeService } from './maintenance-type-service';

describe('MaintenanceTypeService', () => {
  let service: MaintenanceTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
