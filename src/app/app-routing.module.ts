import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AliquotaComponent } from './cadastro/aliquota/aliquota.component';
import { FilialComponent } from './cadastro/filial/filial.component';
import { PerfilComponent } from './cadastro/usuario/perfil/perfil.component';
import { UsuarioComponent } from './cadastro/usuario/usuario.component';
import { LoginComponent } from './externo/login/login.component';
import { NovaSenhaComponent } from './externo/nova-senha/nova-senha.component';
import { RecuperarSenhaComponent } from './externo/recuperar-senha/recuperar-senha.component';
import { FreteComponent } from './frete/editar/frete.component';
import { ListarFretesComponent } from './frete/listar-fretes/listar-fretes.component';
import { HomeComponent } from './home/home.component';
import { ADMINISTRADOR, FATURISTA, OPERACIONAL } from './models/funcao.model';
import { CaptacaoCaminhoneiroComponent } from './relatorios/captacao-caminhoneiro/captacao-caminhoneiro.component';
import { IndicadorDesempenhoFretesComponent } from './relatorios/indicador-desempenho-fretes/indicador-desempenho-fretes.component';
import { IndicadorDesempenhoMarkupComponent } from './relatorios/indicador-desempenho-markup/indicador-desempenho-markup.component';
import { MargemOperacionalComponent } from './relatorios/margem-operacional/margem-operacional.component';
import { MinutaCargaComponent } from './relatorios/minuta/minuta-carga.component';

const routes: Routes = [  
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent
  },
  {
    path: 'nova-senha/:token',
    component: NovaSenhaComponent
  },
  {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
  }, 
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'filial',
    component: FilialComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
  {
    path: 'aliquota',
    component: AliquotaComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'carga',
    component: ListarFretesComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'frete/:numeroCarga/:idFilial',
    component: FreteComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
  {
    path: 'minuta/:idFrete',
    component: MinutaCargaComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR, OPERACIONAL, FATURISTA]
    }
  },
  {
    path: 'margem-operacional',
    component: MargemOperacionalComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
  {
    path: 'indicador-desempenho-frete',
    component: IndicadorDesempenhoFretesComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
  {
    path: 'indicador-desempenho-markup',
    component: IndicadorDesempenhoMarkupComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
  {
    path: 'captacao-caminhoneiros',
    component: CaptacaoCaminhoneiroComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
