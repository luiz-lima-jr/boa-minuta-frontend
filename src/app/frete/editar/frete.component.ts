import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Caminhao } from '../../models/caminhao.model';
import { Filial } from '../../models/filial.model';
import { ExperienciaBomEnum, ExperienciaBomEnumMapping, FobCifEnum, Frete, PagamentoPedagioEnum } from '../../models/frete.model';
import { Motorista } from '../../models/motorista.model';
import { Municipio } from '../../models/municipio.model';
import { PessoaTransporte } from '../../models/pessoa-transporte.model';
import { SessionProfile } from '../../models/session-profile.model';
import { Usuario } from '../../models/usuario-cadastro.model';
import { AlertService } from '../../services/alert.service';
import { CaminhaoService } from '../../services/caminhao.service';
import { FilialService } from '../../services/filial.service';
import { FreteService } from '../../services/frete.service';
import { LoadingService } from '../../services/loading.service';
import { PessoaTransporteService } from '../../services/pessoa-transporte.service';
import { UsuarioService } from '../../services/usuario.service';
import { compareCaminhao, compareExperienciaBom, compareFilial, compareFobCif, comparePagamentoPedagio } from '../../util/compares';
import { isAdm, isFaturista } from '../../util/funcao-helper';


@Component({
  selector: 'app-frete',
  templateUrl: './frete.component.html',
  styleUrls: ['./frete.component.scss']
})
export class FreteComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('inputMotorista') inputMotorista : any;

  formFrete: FormGroup;
  formCaminhao: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'placa', 'valorCarga','resultado', 'responsavel', 
    'faturado', 'municipioDestino', 'cliente', 'volumes', 'dataLimiteCarregamento', 'dataLiberacaoFaturamento', 
    'dataImpressaoMinuta', 'paletizado', 'observacoes'];
  experienciaBomEnumMapping = ExperienciaBomEnumMapping;

  experienciaList = Object.values(ExperienciaBomEnum);
  fobCifsList: FobCifEnum[] = Object.values(FobCifEnum);
  pagamentoPedagioList: PagamentoPedagioEnum[] = Object.values(PagamentoPedagioEnum);
  caminhoesObserver: Observable<Caminhao[]>;
  caminhoesList: Caminhao[];
  pessoasTransportadorObserver: Observable<PessoaTransporte[]>;
  pessoasMotorstaObserver: Observable<PessoaTransporte[]>;
  usuarioObserver: Observable<Usuario[]>;
  pessoasList: PessoaTransporte[];
  numeroCarga: number;
  filial: Filial;
  filiais: Filial[];
  session = new SessionProfile();
  isFaturado: boolean;
  fretePesquisado: Frete;
  placaUppada = false;
  transportadorUppado = false;
  motoristaUppado = false;
  edicaoNro = false;


  constructor(private alertService: AlertService,  private authService: AuthService, private formBuilder: FormBuilder, private caminhaoService: CaminhaoService, 
            private cargaService: FreteService, private pessoaTransporteService: PessoaTransporteService,
            private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, 
            private router: Router, private loadingService: LoadingService, private filialService: FilialService) {
  }

  ngOnInit(): void {   
    this.activatedRoute.params.subscribe((params) => { 
      this.numeroCarga = params['numeroCarga'];
      this.filialService.getById(params['idFilial']).subscribe(f => {
        this.filial = f;
        this.getDetalheCarga();
      });
      
    })

    this.buscarFiliais();
    this.initFreteForm();
    this.initCaminhaoForm();
    const session = this.authService.getSessionProfile();
    if(session){
      this.session = session;
    }

  }
  ngAfterViewInit(): void {
    const motorista = this.formCaminhao.controls['motorista']
    if(!motorista.value){
      motorista.disable();
      this.copiarValorTransportador(false);
    }
  }
  ngOnDestroy(): void {
      this.loadingService.unblockShow();
  }

  initFreteForm(){
    this.formFrete = this.formBuilder.group({
      id: [null],
      numeroCarga: ['', Validators.required],
      faturado: [null],
      filial: [null],
      dataLiberacaoFaturamento: [{value: null, disabled: true}],
      responsavelFaturamento: [null],
      responsavelOperacional: [{value: null, disabled: true}],
      entregas: [{value: null, disabled: true}],
      m3: [{value: null, disabled: true}],
      complemento: [{value: null}],
      municipioOrigem: [{value: null, disabled: true}],
      municipioDestino: [{value: null, disabled: true}],
      dataSaida: [{value: null, disabled: true}],
      valorCarga: [{value: null, disabled: true}, Validators.required],
      pedagio: [0],
      complementoCalculo: [0],
      descontos: [0],
      frete: [{value: null, disabled: true}],
      fobCif: [FobCifEnum.CIF],
      pagamentoPedagio: [PagamentoPedagioEnum.SEM_PEDAGIO],
      nfse: [null],
      fretePago: [null],
      iss: [{value: null, disabled: true}],
      pisCofins: [{value: null, disabled: true}],
      icms: [{value: null, disabled: true}],
      custos: [{value: null, disabled: true}],
      irCs: [{value: null, disabled: true}],
      saldo: [{value: null, disabled: true}],
      margem: [{value: null, disabled: true}],
      markup: [{value: null, disabled: true}],
      observacoes: [''],
      aliquotaCustos: [0],
      aliquotaIcms: [0],
      aliquotaIrcs: [0],
      aliquotaIss: [0],
      aliquotaPisCofins: [0],
      freteCalculado: []
    });
  }

  isFaturista(){
    return isFaturista(this.session);
  }

  isAdm(){
    return isAdm(this.session);
  }

  validarDesabilitarCampos() {
    if(this.isAdm()){
      return;
    }

    if(this.isFaturista() || this.isFaturado){
      this.formFrete.disable();
      this.formCaminhao.disable();    
    }

    if(this.isFaturista() && !this.isFaturado) {
      this.formFrete.controls['faturado'].enable();
      this.formCaminhao.controls['enabled'].enable();
    }
  }

  showSalvar(){
    const regraFaturista = this.isFaturista() && this.formFrete.controls['id'].value && !this.isFaturado;
    const regraFaturado = this.isFaturado && this.isAdm();
    const regraDemais = !this.isFaturado && !this.isFaturista();
    return regraFaturista || regraFaturado || regraDemais;
  }

  showLimpar(){
    return (!this.isFaturista() && !this.isFaturado) || this.isAdm();
  }

  salvar() {
    this.formCaminhao.markAllAsTouched();
    if(this.formFrete.valid && this.formCaminhao.valid) {
      this.loadingService.unblockShow();
      const frete = this.formFrete.getRawValue();
      this.montarCaminhao(frete);
      this.cargaService.salvar(frete).subscribe({
        next: () => {
          this.resetForms();
          this.alertService.success('Frete salvo com sucesso!');
        },
        error: erro => {
          this.alertService.error(erro);
        }
      })
    }
  }

  montarCaminhao(frete: Frete){  
    const caminhaoForm = this.formCaminhao.getRawValue();
    const caminhao = new Caminhao();
    caminhao.id = caminhaoForm.id;
    caminhao.motoristaDiferente = caminhaoForm.motoristaDiferente;

    if(caminhaoForm.placa) {
      caminhao.placa = caminhaoForm.placa; 
    }
    if(typeof(caminhaoForm.motorista) === 'string') {
      caminhao.motorista = new Motorista();
      caminhao.motorista.pessoaTransporte = new PessoaTransporte();
      caminhao.motorista.pessoaTransporte.nome =  caminhaoForm.motorista.toUpperCase();
      caminhao.motorista.experiencia = caminhaoForm.experiencia;
    } else {
      caminhao.motorista = caminhaoForm.motorista;
    }
    
    if(typeof(caminhaoForm.transportador) === 'string') {
      caminhao.transportador = new PessoaTransporte();
      caminhao.transportador.nome =  caminhaoForm.transportador.toUpperCase();
    } else {
      caminhao.transportador = caminhaoForm.transportador;
    }
    caminhao.dataAlteracao = caminhaoForm.dataAlteracao;
    frete.caminhao = caminhao;
  }

  setValorFreteChange() {    
    this.formFrete.controls['valorCarga'].valueChanges.subscribe(() => {
      this.calcularValorFrete();
    });
  }

  calcularValorFrete(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const pedagio = this.formFrete.controls['pedagio'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    this.formFrete.controls['frete'].setValue(valorCarga + complementoCalculo - pedagio);
    this.calcularMarkup();
  }

  calcularCampos(){
    this.calcularPisCofins();
    this.calcularIcms();
    this.calcularValorFrete();
    this.calcularCustos();
    this.calcularIrcs();
    this.calcularSaldo();
    this.calcularMargem();
    this.calcularMarkup();
  }

  initCaminhaoForm(){
    this.formCaminhao = this.formBuilder.group({
      id: [null],
      placa: ['', Validators.required],
      transportador: ['', Validators.required],
      motorista: ['', Validators.required],
      experiencia: ['', Validators.required],
      motoristaDiferente: [false],
      dataAlteracao: [''],
      enabled: []
    });
    this.caminhoesList = [];
    //this.formCaminhao.disable();
  }

  initChanges(){
    this.initTransportadorObserver();
    this.initMotoristaObserver();
    this.initUsuarioObserver();
    this.initPlacaChanges();
    this.nfseChange();
    this.complementoCalculoChange();
    this.setValorFreteChange();
    this.fretePagoChange();
    this.pedagioChange();
  }

  initTransportadorObserver() {
    this.formCaminhao.controls['transportador'].valueChanges.subscribe(
      value => {
        this.loadingService.blockShow();
        if(value?.nome){
          this.pessoasTransportadorObserver = this.pessoaTransporteService.getByNome(value.nome.toUpperCase());
        } else if(value) {          
          this.pessoasTransportadorObserver = this.pessoaTransporteService.getByNome(value.toUpperCase());
        }
      }
    );
  }

  initUsuarioObserver(){    
    this.formFrete.controls['responsavelOperacional'].valueChanges.subscribe(
      value => {
        this.loadingService.blockShow();
        if(value?.nome){
          this.usuarioObserver = this.usuarioService.getByNome(value.nome.toUpperCase());
        } else if(value) {          
          this.usuarioObserver = this.usuarioService.getByNome(value.toUpperCase());
        }
      }
    );
  }

  initMotoristaObserver(){
    this.formCaminhao.controls['motorista'].valueChanges.subscribe(
      value => {     
        if(this.isMotoristaDiferente()) {
          return;
        }
        this.loadingService.blockShow();
        if(value?.pessoaTransporte && value?.pessoaTransporte.nome){
          this.pessoasMotorstaObserver = this.pessoaTransporteService.getByNome(value.pessoaTransporte.nome.toUpperCase());
        } else if(value && typeof(value) === 'string') {          
          this.pessoasMotorstaObserver = this.pessoaTransporteService.getByNome(value.toUpperCase());
        }
      }
    );
  }
  
  changeTransportadorText(evento: any){   
    const valor = evento.srcElement.value;
    if(!this.isMotoristaDiferente() && typeof(valor) === 'string') {
      this.formCaminhao.controls['motorista'].setValue(valor);
      this.addInputValueMotorista(valor);
    }
  }


  motoristaChange(event: any){
    const experiencia = event.option.value.experiencia;
    this.formCaminhao.controls['experiencia'].setValue(experiencia);
  }
 
  transportadorChange(){    
    if(this.isMotoristaDiferente()) {
      this.formCaminhao.controls['motorista'].setValue(this.formCaminhao.controls['transportador'].value);
      return;
    }
  }

  initPlacaChanges() {
    this.formCaminhao.controls['placa'].valueChanges.subscribe(
      value => {
        this.loadingService.blockShow();
        if(value && typeof(value) === 'string') {
          this.caminhoesObserver = this.caminhaoService.getByPlaca(value.toUpperCase());
        }
      }
    );
  }   
  
  caminhaoChange(event: any){    
    this.formCaminhao.patchValue(event.option.value);
    this.formCaminhao.controls['experiencia'].setValue(event.option?.value?.motorista?.experiencia)
  }

  upperPlaca(evento: any){
    if(!this.placaUppada){
      this.placaUppada = true;
      this.formCaminhao.controls['placa'].setValue(evento.toUpperCase());
      this.placaUppada = false;
    }
  }
  
  upperTransportador(evento: any){
    if(!this.transportadorUppado){
      this.transportadorUppado = true;
      this.formCaminhao.controls['transportador'].setValue(evento.toUpperCase());
      this.transportadorUppado = false;
    }
  }
  upperMotorista(evento: any){
    if(!this.motoristaUppado){
      this.transportadorUppado = true;
      this.formCaminhao.controls['motorista'].setValue(evento.toUpperCase());
      this.motoristaUppado = false;
    }
  }

  valorCargaChange(){
    this.formFrete.controls['valorCarga'].valueChanges.subscribe(() => this.calcularCampos());
  }

  nfseChange() {
    this.formFrete.controls['nfse'].valueChanges.subscribe(value => {
      this.calcularIcms();
      this.calcularIss();
    });
  }

  pedagioChange() {    
    this.formFrete.controls['pedagio'].valueChanges.subscribe(() => {
      this.calcularValorFrete();
      this.calcularSaldo();
      this.calcularIcms();
      this.calcularMargem();
    });
  }
  



  complementoCalculoChange(){
    this.formFrete.controls['complementoCalculo'].valueChanges.subscribe(() => this.calcularCampos());
  }

  fretePagoChange(){
    this.formFrete.controls['fretePago'].valueChanges.subscribe(() => this.calcularCampos());
  }

  calcularIss(){
    const valorNfse = this.formFrete.controls['nfse'].value;
    const valorIss = this.formFrete.controls['aliquotaIss'].value / 100;
    this.formFrete.controls['iss'].setValue(valorNfse * valorIss);
    this.calcularIcms();
    this.calcularSaldo();
  }

  calcularPisCofins(){
    const aliquotaPisCofins = this.formFrete.controls['aliquotaPisCofins'].value / 100;
    const valorCarga = this.formFrete.controls['valorCarga'].value ;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value ;
    this.formFrete.controls['pisCofins'].setValue((complementoCalculo + valorCarga) * aliquotaPisCofins);    
    this.calcularSaldo();
    this.calcularCustos();
    this.calcularIrcs();
  }

  calcularCustos(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaCustos = this.formFrete.controls['aliquotaCustos'].value / 100;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const icms = this.formFrete.controls['icms'].value;

    const custos = (valorCarga + complementoCalculo - pisCofins - icms) * aliquotaCustos;
    this.formFrete.controls['custos'].setValue(custos);
    this.calcularSaldo();
  }

  calcularIcms(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const frete = this.formFrete.controls['frete'].value;
    let pedagio = this.formFrete.controls['pedagio'].value;
    const iss = this.formFrete.controls['iss'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaIcms = this.formFrete.controls['aliquotaIcms'].value / 100;
    const origem = this.formFrete.controls['municipioOrigem'].value;

    if(origem?.municipio?.estado?.sigla === 'PR'){
      pedagio = 0;
    }

    const icms = (frete + pedagio + complementoCalculo) * aliquotaIcms;
    this.formFrete.controls['icms'].setValue(icms);
    this.calcularSaldo();
    this.calcularCustos();
    this.calcularIrcs();

  }

  calcularIrcs(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaIrcs = this.formFrete.controls['aliquotaIrcs'].value / 100;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const icms = this.formFrete.controls['icms'].value;

    const irCs = (valorCarga + complementoCalculo - pisCofins - icms) * aliquotaIrcs;
    this.formFrete.controls['irCs'].setValue(irCs);
    this.calcularSaldo();
  }
//(Valor da Carga + Complemento - frete pago - pedagio - pis - icms - custos - ir)
  calcularSaldo(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const fretePago = this.formFrete.controls['fretePago'].value;
    const pedagio = this.formFrete.controls['pedagio'].value;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const icms = this.formFrete.controls['icms'].value;
    const custos = this.formFrete.controls['custos'].value;
    const irCs = this.formFrete.controls['irCs'].value;
    const iss = this.formFrete.controls['iss'].value;
    const saldo = valorCarga + complementoCalculo - fretePago - pedagio - pisCofins - icms - custos - irCs - iss;
    this.formFrete.controls['saldo'].setValue(saldo);
    this.calcularMargem();
  }

  calcularMargem() {
    const saldo = this.formFrete.controls['saldo'].value;
    const frete = this.formFrete.controls['frete'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const pedagio = this.formFrete.controls['pedagio'].value;
    const icms = this.formFrete.controls['icms'].value;
    const margem = saldo / (frete + pedagio + complementoCalculo - pisCofins - icms) * 100;
    this.formFrete.controls['margem'].setValue(margem);
  }

  calcularMarkup() {
    const frete = this.formFrete.controls['frete'].value;
    const fretePago = this.formFrete.controls['fretePago'].value;
    const markup = frete / fretePago - 1;
    
    this.formFrete.controls['markup'].setValue(markup);
  }
  
  displayNome(pessoa: PessoaTransporte): string {
    return pessoa && pessoa.nome ? pessoa.nome : '';
  }
  displayNomeMotorista(motorista: Motorista): string {
    return motorista && motorista.pessoaTransporte ? motorista.pessoaTransporte.nome : '';
  }

  displayMunicipio(municipio: Municipio): string {
    return municipio ? `${municipio.estado.sigla} - ${municipio.nome}` : '';
  }

  displayMunicipioOrigem(municipio: Filial): string {
    return municipio ? `${municipio.nome}` : '';
  }

  displayNomeUsuario(usuario: Usuario): string {
    return usuario && usuario.nome ? usuario.nome : '';
  }

  resetForm(ngFormFrete: any, ngFormCaminhao: any){
    ngFormFrete.resetForm();
    ngFormCaminhao.resetForm();

    this.formFrete.controls['id'].setValue(this.fretePesquisado.id);
    this.formFrete.controls['numeroCarga'].setValue(this.fretePesquisado.numeroCarga);
    this.formFrete.controls['faturado'].setValue(this.fretePesquisado.faturado);
    this.formFrete.controls['filial'].setValue(this.fretePesquisado.filial);
    this.formFrete.controls['dataLiberacaoFaturamento'].setValue(this.fretePesquisado.dataLiberacaoFaturamento);
    this.formFrete.controls['responsavelFaturamento'].setValue(this.fretePesquisado.responsavelFaturamento);
    this.formFrete.controls['entregas'].setValue(this.fretePesquisado.entregas);
    this.formFrete.controls['responsavelOperacional'].setValue(this.fretePesquisado.responsavelOperacional);this.formFrete.controls['m3'].setValue(this.fretePesquisado.m3);
    this.formFrete.controls['entregas'].setValue(this.fretePesquisado.entregas);
    this.formFrete.controls['dataSaida'].setValue(this.fretePesquisado.dataSaida);
    this.formFrete.controls['municipioOrigem'].setValue(this.fretePesquisado.municipioOrigem);
    this.formFrete.controls['municipioOrigem'].setValue(this.fretePesquisado.municipioOrigem);
   
    ngFormFrete.markAsUntouched();
}

resetForms(){
  this.formFrete.reset();
  this.formFrete.markAsUntouched();
  this.formCaminhao.reset();
  this.formFrete.controls['filial'].setValue(this.fretePesquisado.filial);
  this.edicaoNro = true;
}

  compareExperienciaBom(f1: ExperienciaBomEnum, f2: ExperienciaBomEnum){
    return compareExperienciaBom(f1, f2)
  }

  compareFobCif(f1: FobCifEnum, f2: FobCifEnum){
    return compareFobCif(f1, f2)
  }

  comparePagamentoPedagio(f1: PagamentoPedagioEnum, f2: PagamentoPedagioEnum){
    return comparePagamentoPedagio(f1, f2)
  }

  compareCaminhao(f1: Caminhao, f2: Caminhao){
    return compareCaminhao(f1, f2)
  }

  getDetalheCarga(){
    this.cargaService.getReceberDetalheCarga(this.numeroCarga, this.filial?.id).subscribe({
      next: result => {    
        this.fretePesquisado = result;
        
        this.initChanges();
        this.setCaminhaoPlaca(result);
        if(result.dataSaida){
          result.dataSaida = new Date(result.dataSaida);
        }
        this.isFaturado = result.faturado;
        this.formFrete.patchValue(result);
        this.validarDesabilitarCampos();
        this.calcularCampos();
        this.edicaoNro = false; 
        this.router.navigateByUrl(`frete/${this.numeroCarga}/${this.filial?.id}`);
        debugger
      },
      error: error => this.alertService.error(error.error.detail)
    })
  }

  setCaminhaoPlaca(frete: Frete){
    if(frete.caminhao){
      this.formCaminhao.patchValue(frete.caminhao);
      this.formCaminhao.controls['experiencia'].setValue(frete.caminhao.motorista?.experiencia);
    } else if(frete.placa) {
      this.caminhaoService.getByPlaca(frete.placa).subscribe({
        next: resp =>{
          if(resp && resp.length > 0) {
            this.formCaminhao.patchValue(resp[0]);
            this.formCaminhao.controls['experiencia'].setValue(resp[0].motorista?.experiencia);
          } else {            
            this.formCaminhao.controls['placa'].setValue(frete.placa);
          }
        }
      })
    }
  }

  getResponsavelFaturamento(){
    const responsavel =  this.formFrete.controls['responsavelFaturamento'].value;
    return responsavel ? ': ' + responsavel.nome : '';
  }

  voltar(){
    this.router.navigateByUrl('/carga');
  }  

  imprimir(){
    this.router.navigateByUrl('/minuta/'+this.formFrete.controls['id'].value);
  }
  
  habilitarCampoMotoristaClick(){
    const motoristaDiferente = this.formCaminhao.controls['motoristaDiferente'];
    const habilitar = !this.isMotoristaDiferente();
    motoristaDiferente.setValue(habilitar);
    this.copiarValorTransportador(habilitar);
  }

  private copiarValorTransportador(habilitar: boolean){
    const controlMotorista = this.formCaminhao.controls['motorista'];
    const experiencia = this.formCaminhao.controls['experiencia'];
    if(habilitar) {
      controlMotorista.setValue(null);
      controlMotorista.enable();
    } else {
      const transportador = JSON.parse(JSON.stringify(this.formCaminhao.controls['transportador'].value));
      controlMotorista.setValue(transportador);
      controlMotorista.disable();
      const isString = typeof(controlMotorista.value) === 'string';
      if(experiencia && !isString ){
        controlMotorista.value.experiencia = experiencia.value;
      } 
      if(isString) {
        this.addInputValueMotorista(controlMotorista.value);
      }
    }
  }

  addInputValueMotorista(valor: string){
    setTimeout(() => {
      this.inputMotorista.nativeElement.value = valor;
    }, 5);
  }

  isMotoristaDiferente(){
    return this.formCaminhao.controls['motoristaDiferente'].value;
  }

  alterarNumeroCarga(){
    this.edicaoNro = true;
  }

  pesquisarNovaCarga(){    
    this.numeroCarga =  this.formFrete.controls['numeroCarga'].value;  
    this.filial =  this.formFrete.controls['filial'].value;  
    this.getDetalheCarga();
  }
  
  compareFilial(f1: Filial, f2: Filial): boolean {
    return compareFilial(f1, f2);
  }

  buscarFiliais(){
    this.filialService.getAllUsuario().subscribe(f => this.filiais = f);
  }
}
