import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { LoginComponent } from './externo/login/login.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { GiftHttpInterceptor as BoaMinutaHttpInterceptor } from 'http.interceptor';
import { environment } from 'src/environments/environment';
import { LoadingComponent } from './components/loading/loading.component';
import { AuthService } from './auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilialComponent } from './cadastro/filial/filial.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ConfirmDialogComponent } from './components/confirm/confirm-modal/confirm-modal.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { RecuperarSenhaComponent } from './externo/recuperar-senha/recuperar-senha.component';
import { NovaSenhaComponent } from './externo/nova-senha/nova-senha.component';
import { PerfilComponent } from './usuario/perfil/perfil.component';
import { AliquotaComponent } from './aliquota/aliquota.component';
import { CargaComponent } from './carga/carga.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FreteComponent } from './frete/frete.component';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MinutaCargaComponent } from './relatorios/minuta/minuta-carga.component';
import localePt from '@angular/common/locales/pt';
import { PedidoMinutaCargaComponent } from './relatorios/minuta/pedidos/pedido-minuta-carga.component';
import { ClientesMinutaCargaComponent } from './relatorios/minuta/clientes/clientes-minuta-carga.component';
import { NgxPrintModule } from 'ngx-print';
import { DecimalZeroDefaultDirective } from './directives/decimal-zero-default';
import { MargemOperacionalComponent } from './relatorios/margem-operacional/margem-operacional.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoadingComponent,
    LoginComponent,
    FilialComponent,
    UsuarioComponent,
    ConfirmComponent,
    ConfirmDialogComponent,
    RecuperarSenhaComponent,
    NovaSenhaComponent,
    PerfilComponent,
    AliquotaComponent,
    CargaComponent,
    FreteComponent,
    MinutaCargaComponent,
    PedidoMinutaCargaComponent,
    ClientesMinutaCargaComponent,
    DecimalZeroDefaultDirective,
    MargemOperacionalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective, 
    NgxPrintModule,
    NgxMaskPipe,
    MatPaginatorModule
  ],
  providers: [
    HttpClient,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BoaMinutaHttpInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: "BASE_API_URL", useValue: environment.apiUrl },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: '-0300' },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
