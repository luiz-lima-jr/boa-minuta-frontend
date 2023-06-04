import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let service: AuthService;

  const sessionSpy = jasmine.createSpyObj(['exists', 'setCookieAndRedirect']);
  let oktaAuthSpy = jasmine.createSpyObj( 'OktaAuth', ['signInWithCredentials', 'signOut'], {
    session: sessionSpy
  } );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: oktaAuthSpy }
      ]
    });

    sessionSpy.exists.and.resolveTo(false);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
