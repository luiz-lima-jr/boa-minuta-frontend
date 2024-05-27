import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private usuarioService: UsuarioService, private loading: LoadingService) { }

  ngOnInit(): void {
    this.loading.blockShow();
    this.usuarioService.validarSessao().subscribe({
      complete: () => this.loading.unblockShow()
    });
  }

}
