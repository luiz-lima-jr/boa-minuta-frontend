import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './externo/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { FilialComponent } from './filial/filial.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ADMINISTRADOR } from './models/funcao.model';
import { RecuperarSenhaComponent } from './externo/recuperar-senha/recuperar-senha.component';
import { NovaSenhaComponent } from './externo/nova-senha/nova-senha.component';
import { PerfilComponent } from './usuario/perfil/perfil.component';

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
    path: 'usuario',
    component: UsuarioComponent,
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
