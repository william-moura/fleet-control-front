import { TestBed } from '@angular/core/testing';

import { RolesServices } from './roles-services';

describe('RolesServices', () => {
  let service: RolesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
