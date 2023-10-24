import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilialService } from '../services/filial.service';
import { Observable, map, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { compareExperienciaBom, compareFilial, compareFobCif, comparePagamentoPedagio } from '../util/compares';
import { ExperienciaBomEnum, ExperienciaBomEnumMapping, FobCifEnum, Frete, PagamentoPedagioEnum } from '../models/frete.model';
import { Caminhao } from '../models/caminhao.model';
import { CaminhaoService } from '../services/caminhao.service';
import { LoadingService } from '../services/loading.service';
import { PessoaTransporte } from '../models/pessoa-transporte.model';
import { PessoaTransporteService } from '../services/pessoa-transporte.service';
import { CargaService } from '../services/carga.service';
import { Usuario } from '../models/usuario-cadastro.model';
import { UsuarioService } from '../services/usuario.service';
import { Filial } from '../models/filial.model';
import { Carga } from '../models/carga.model';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../auth/auth.service';
import { SessionProfile } from '../models/session-profile.model';
import { isAdm, isFaturista, isOperacional } from '../util/funcao-helper';
import { Municipio } from '../models/municipio.model';


@Component({
  selector: 'app-frete',
  templateUrl: './frete.component.html',
  styleUrls: ['./frete.component.scss']
})
export class FreteComponent implements OnInit {

  formFrete: FormGroup;
  formCaminhao: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'placa', 'valorCarga','resultado', 'responsavel', 
    'faturado', 'municipioDestino', 'cliente', 'volumes', 'dataLimiteCarregamento', 'dataLiberacaoFaturamento', 
    'dataImpressaoMinuta', 'paletizado', 'observacoes'];
  experienciaBomEnumMapping = ExperienciaBomEnumMapping;
  //experienciaList: ExperienciaBomEnum[] = [ExperienciaBomEnum.NOVO_PARA_CARREGAMENTO, ExperienciaBomEnum.CARREGA_SEMPRE, ExperienciaBomEnum.RETORNANDO];
  experienciaList = Object.values(ExperienciaBomEnum);
  fobCifsList: FobCifEnum[] = Object.values(FobCifEnum);
  pagamentoPedagioList: PagamentoPedagioEnum[] = [PagamentoPedagioEnum.TAG, PagamentoPedagioEnum.CARTAO];
  caminhoesObserver: Observable<Caminhao[]>;
  caminhoesList: Caminhao[];
  pessoasTransportadorObserver: Observable<PessoaTransporte[]>;
  pessoasMotorstaObserver: Observable<PessoaTransporte[]>;
  usuarioObserver: Observable<Usuario[]>;
  pessoasList: PessoaTransporte[];
  numeroCarga: number;
  idFilial: number;
  filial?: Filial;
  session = new SessionProfile();
  isFaturado: boolean;

  constructor(private alertService: AlertService,  private authService: AuthService, private formBuilder: FormBuilder, private caminhaoService: CaminhaoService, 
            private cargaService: CargaService, private pessoaTransporteService: PessoaTransporteService,
            private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, 
            private router: Router, private loadingService: LoadingService, private filialService: FilialService) {
  }

  ngOnInit(): void {    
    this.activatedRoute.params.subscribe((params) => { 
      this.numeroCarga = params['numeroCarga'];
      this.idFilial = params['idFilial'];
    })

    this.filialService.getById(this.idFilial).subscribe(f => this.filial = f);

    this.initFreteForm();
    this.initCaminhaoForm();
    this.getDetalheCarga();
    this.initChanges();
    const session = this.authService.getSessionProfile();
    if(session){
      this.session = session;
    }
  }

  initFreteForm(){
    this.formFrete = this.formBuilder.group({
      id: [null],
      numeroCarga: ['', Validators.required],
      faturado: [null],
      filial: [null],
      responsavelFaturamento: [null],
      responsavelOperacional: [{value: null, disabled: true}],
      entregas: [{value: null, disabled: true}],
      m3: [{value: null, disabled: true}],
      complemento: [{value: null, disabled: true}],
      municipioOrigem: [{value: null, disabled: true}],
      municipioDestino: [{value: null, disabled: true}],
      dataSaida: [{value: null, disabled: true}],
      dataLiberacaoFaturamento: [{value: null, disabled: true}],
      valorCarga: [{value: null, disabled: true}, Validators.required],
      pedagio: [null],
      complementoCalculo: [null],
      descontos: [null],
      frete: [{value: null, disabled: true}],
      fobCif: [null],
      pagamentoPedagio: [null],
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
      aliquotaPisCofins: [0]
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
    debugger
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
          this.getDetalheCarga();
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

    if(caminhaoForm.placa) {
      caminhao.placa = caminhaoForm.placa; 
    }
    if(typeof(caminhaoForm.motorista) === 'string') {
      caminhao.motorista = new PessoaTransporte();
      caminhao.motorista.nome =  caminhaoForm.motorista;
      caminhao.motorista.experiencia = caminhaoForm.experiencia;
    } else {
      caminhao.motorista = caminhaoForm.motorista;
    }
    
    if(typeof(caminhaoForm.transportador) === 'string') {
      caminhao.transportador = new PessoaTransporte();
      caminhao.transportador.nome =  caminhaoForm.transportador;
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
  }

  initTransportadorObserver() {
    this.formCaminhao.controls['transportador'].valueChanges.subscribe(
      value => {
        this.loadingService.blockShow();
        if(value.nome){
          this.pessoasTransportadorObserver = this.pessoaTransporteService.getByNome(value.nome.toUpperCase());
        } else {          
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
        this.loadingService.blockShow();
        if(value.nome){
          this.pessoasMotorstaObserver = this.pessoaTransporteService.getByNome(value.nome.toUpperCase());
        } else {          
          this.pessoasMotorstaObserver = this.pessoaTransporteService.getByNome(value.toUpperCase());
        }
      }
    );
  }

  motoristaChange(event: any){
    const experiencia = event.option.value.experiencia;
    this.formCaminhao.controls['experiencia'].setValue(experiencia);
  }

  initPlacaChanges() {
    this.formCaminhao.controls['placa'].valueChanges.subscribe(
      value => {
        this.loadingService.blockShow();
        this.caminhoesObserver = this.caminhaoService.getByPlaca(value.toUpperCase());
      }
    );
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
  }

  calcularPisCofins(){
    const aliquotaPisCofins = this.formFrete.controls['aliquotaPisCofins'].value / 100;
    const valorCarga = this.formFrete.controls['valorCarga'].value ;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value ;
    this.formFrete.controls['pisCofins'].setValue((complementoCalculo + valorCarga) * aliquotaPisCofins);    
  }

  calcularIcms(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const nfse = this.formFrete.controls['nfse'].value;
    const iss = this.formFrete.controls['iss'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaIcms = this.formFrete.controls['aliquotaIcms'].value / 100;

    const icms = (valorCarga - nfse - iss + complementoCalculo) * aliquotaIcms;
    this.formFrete.controls['icms'].setValue(icms);
  }

  calcularCustos(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaCustos = this.formFrete.controls['aliquotaCustos'].value / 100;

    const custos = (valorCarga + complementoCalculo) * aliquotaCustos;
    this.formFrete.controls['custos'].setValue(custos);
  }

  calcularIrcs(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const aliquotaIrcs = this.formFrete.controls['aliquotaIrcs'].value / 100;
    const irCs = (valorCarga + complementoCalculo) * aliquotaIrcs;
    this.formFrete.controls['irCs'].setValue(irCs);
  }

  calcularSaldo(){
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const fretePago = this.formFrete.controls['fretePago'].value;
    const pedagio = this.formFrete.controls['pedagio'].value;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const icms = this.formFrete.controls['icms'].value;
    const custos = this.formFrete.controls['custos'].value;
    const irCs = this.formFrete.controls['irCs'].value;
    const saldo = valorCarga + complementoCalculo - (fretePago + pedagio + pisCofins + icms + custos + irCs);
    this.formFrete.controls['saldo'].setValue(saldo);
  }

  calcularMargem() {
    const saldo = this.formFrete.controls['saldo'].value;
    const valorCarga = this.formFrete.controls['valorCarga'].value;
    const complementoCalculo = this.formFrete.controls['complementoCalculo'].value;
    const pisCofins = this.formFrete.controls['pisCofins'].value;
    const icms = this.formFrete.controls['icms'].value;
    const margem = saldo / (valorCarga + complementoCalculo - pisCofins - icms);
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
    ngFormFrete.markAsUntouched();
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

  getDetalheCarga(){
    this.cargaService.getReceberDetalheCarga(this.numeroCarga, this.idFilial).subscribe({
      next: result => {    
        this.setCaminhaoPlaca(result);
        if(result.dataSaida){
          result.dataSaida = new Date(result.dataSaida);
        }
        this.isFaturado = result.faturado;
        this.formFrete.patchValue(result);
        this.validarDesabilitarCampos();
      },
      error: error => this.alertService.error(error.error.detail)
    })
  }

  setCaminhaoPlaca(frete: Carga){
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
  
}
