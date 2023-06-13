import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { FilialComponent } from './filial/filial.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ADMINISTRADOR } from './models/funcao.model';

const routes: Routes = [
  {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
  }, 
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
    data: {
      funcoes: [ADMINISTRADOR]
    } 
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
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
