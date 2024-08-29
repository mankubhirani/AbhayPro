import { TestBed } from '@angular/core/testing';

import { NonAuthguardGuard } from './non-authguard.guard';

describe('NonAuthguardGuard', () => {
  let guard: NonAuthguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonAuthguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
