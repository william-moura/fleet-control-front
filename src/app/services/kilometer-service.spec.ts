import { TestBed } from '@angular/core/testing';

import { KilometerService } from './kilometer-service';

describe('KilometerService', () => {
  let service: KilometerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KilometerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
