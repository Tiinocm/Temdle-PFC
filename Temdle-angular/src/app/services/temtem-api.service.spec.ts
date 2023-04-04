import { TestBed } from '@angular/core/testing';

import { TemtemApiService } from './temtem-api.service';

describe('TemtemApiService', () => {
  let service: TemtemApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemtemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
