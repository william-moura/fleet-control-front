import { TestBed } from '@angular/core/testing';

import { PrefeituraService } from './prefeitura-service';

describe('PrefeituraService', () => {
  let service: PrefeituraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefeituraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
