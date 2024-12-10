import { TestBed } from '@angular/core/testing';

import { AgoraServiceService } from './agora-service.service';

describe('AgoraServiceService', () => {
  let service: AgoraServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgoraServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
