import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent  {
 
  visible = false;
  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.getEstado().subscribe((estado) => (this.visible = estado));
  }
}
