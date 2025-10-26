import { TestBed } from '@angular/core/testing';

import { AddressDialogService } from './address-dialog.service';

describe('AddressDialogService', () => {
  let service: AddressDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
