import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { AuthService } from './auth/auth.service';

describe('AppComponent', () => {
  let authSpy = jasmine.createSpyObj<AuthService>([], {
    isAuthenticated: of(false)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'boa-minuta-frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Boa Minuta');
  });

  it('should render title in a button', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const buttons = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Boa Minuta' }));
    expect(buttons).toHaveSize(1);
  });
});
