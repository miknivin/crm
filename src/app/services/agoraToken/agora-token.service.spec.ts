import { TestBed } from '@angular/core/testing';

import { AgoraTokenService } from './agora-token.service';

describe('AgoraTokenService', () => {
  let service: AgoraTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgoraTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
