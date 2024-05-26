import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GiftHttpInterceptor as BoaMinutaHttpInterceptor } from 'http.interceptor';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { FilialComponent } from './cadastro/filial/filial.component';
import { ConfirmDialogComponent } from './components/confirm/confirm-modal/confirm-modal.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoginComponent } from './externo/login/login.component';
import { NovaSenhaComponent } from './externo/nova-senha/nova-senha.component';
import { RecuperarSenhaComponent } from './externo/recuperar-senha/recuperar-senha.component';
import { FreteComponent } from './frete/editar/frete.component';
import { ListarFretesComponent } from './frete/listar-fretes/listar-fretes.component';

import localePt from '@angular/common/locales/pt';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxPrintModule } from 'ngx-print';
import { DecimalZeroDefaultDirective } from './directives/decimal-zero-default';
import { IndicadorDesempenhoFretesComponent } from './relatorios/indicador-desempenho-fretes/indicador-desempenho-fretes.component';
import { IndicadorDesempenhoMarkupComponent } from './relatorios/indicador-desempenho-markup/indicador-desempenho-markup.component';
import { MargemOperacionalComponent } from './relatorios/margem-operacional/margem-operacional.component';
import { ClientesMinutaCargaComponent } from './relatorios/minuta/clientes/clientes-minuta-carga.component';
import { MinutaCargaComponent } from './relatorios/minuta/minuta-carga.component';
import { PedidoMinutaCargaComponent } from './relatorios/minuta/pedidos/pedido-minuta-carga.component';

import { MatSortModule } from '@angular/material/sort';
import { AliquotaComponent } from './cadastro/aliquota/aliquota.component';
import { PerfilComponent } from './cadastro/usuario/perfil/perfil.component';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { CaptacaoCaminhoneiroComponent } from './relatorios/captacao-caminhoneiro/captacao-caminhoneiro.component';

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
    ListarFretesComponent,
    FreteComponent,
    MinutaCargaComponent,
    PedidoMinutaCargaComponent,
    ClientesMinutaCargaComponent,
    DecimalZeroDefaultDirective,
    MargemOperacionalComponent,
    IndicadorDesempenhoFretesComponent,
    IndicadorDesempenhoMarkupComponent,
    CaptacaoCaminhoneiroComponent
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
    MatPaginatorModule,
    MatSortModule
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