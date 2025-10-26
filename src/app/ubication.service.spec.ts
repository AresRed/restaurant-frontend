import { TestBed } from '@angular/core/testing';

import { UbicationService } from './ubication.service';

describe('UbicationService', () => {
  let service: UbicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
