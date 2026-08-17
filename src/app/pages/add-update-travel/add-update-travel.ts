import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AsyncSelect } from '../../components/async-select/async-select';
import { Driver } from '../../models/driver';
import { Orgao } from '../../models/orgao';
import { Prefeitura } from '../../models/prefeitura';
import { Secretaria } from '../../models/secretaria';
import { Travel } from '../../models/travel';
import { Vehicle } from '../../models/vehicle';
import { PrefeituraService } from '../../services/prefeitura-service';
import { VehicleService } from '../../services/vehicle-service';
import { GoogleMap, MapMarker, MapDirectionsRenderer } from '@angular/google-maps';
import { TravelService } from '../../sevices/travel-service';
import { NgxMaskDirective } from 'ngx-mask';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-update-travel',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    AsyncSelect,
    GoogleMap,
    MapMarker,
    MapDirectionsRenderer,
    NgxMaskDirective,
    MatAutocompleteModule
  ],
  templateUrl: './add-update-travel.html',
  styleUrl: './add-update-travel.scss',
})
export class AddUpdateTravel {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private prefeituraService = inject(PrefeituraService);
  private vehicleService = inject(VehicleService);
  private cdr = inject(ChangeDetectorRef);
  private travelService = inject(TravelService);

  form: FormGroup;
  update = signal(false);
  loading = signal(false);
  travel = signal<Travel | null>(null);

  prefeituras$ = signal<Observable<Prefeitura[]>>(of([]));
  orgaos$ = signal<Observable<Orgao[]>>(of([]));
  secretarias$ = signal<Observable<Secretaria[]>>(of([]));
  vehicles$ = signal<Observable<Vehicle[]>>(of([]));
  drivers$ = signal<Observable<Driver[]>>(of([]));

  statusOptions = ['Agendada', 'Em andamento', 'Concluída', 'Cancelada'];

  // Queries baseadas em Signals do Angular moderno
  private inputOrigemEl = viewChild<ElementRef<HTMLInputElement>>('inputOrigem');
  private inputDestinoEl = viewChild<ElementRef<HTMLInputElement>>('inputDestino');
  private CHAVE_DO_GOOGLE_MAPS = 'AIzaSyDgxIkKNYOom_ZzmE5BdhPmlqQCRpZVag4';


  // Informações de exibição da viagem
  center = signal<google.maps.LatLngLiteral>({ lat: -23.5505, lng: -46.6333 });
  zoom = signal<number>(12);

  // Estados dos inputs
  origem = signal<string>('');
  destino = signal<string>('');

  // Dados da rota
  distancia = signal<string>('');
  duracao = signal<string>('');
  directionsResults = signal<google.maps.DirectionsResult | undefined>(undefined);

  // Observable que alimenta o renderizador de rotas
  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
  apiCarregada = signal<boolean>(false);

  private map!: L.Map;
  private routeLayer?: L.GeoJSON;
  private http = inject(HttpClient);
  sugestoesOrigem: any[] = [];
  sugestoesDestino: any[] = [];
  coordsOrigem?: { lat: number; lng: number };
  coordsDestino?: { lat: number; lng: number };

  constructor() {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      vehicleId: [null, Validators.required],
      driverId: [null, Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [null],
      status: ['Agendada', Validators.required],
      prefeituraId: ['', Validators.required],
      orgaoId: ['', Validators.required],
      secretariaId: ['', Validators.required],
      odometerDeparture: ['', Validators.required],
      odometerEntry: [null],
      distanceKm: [{value: '', disabled: true}],
      distanceMeters: [{value: '', disabled: true}],
      travelTime: [{value: '', disabled: true}],
    });
  }

  ngOnInit() {
    this.update.set(false);
    this.getPrefeituras();
    this.getVehicles();

    this.form.get('prefeituraId')?.valueChanges.subscribe((prefeituraId) => {
      this.form.patchValue({ orgaoId: null, secretariaId: null }, { emitEvent: false });
      this.orgaos$.set(of([]));
      this.secretarias$.set(of([]));
      if (prefeituraId) {
        this.getOrgaos();
      }
    });

    this.form.get('orgaoId')?.valueChanges.subscribe((orgaoId) => {
      this.form.patchValue({ secretariaId: null }, { emitEvent: false });
      this.secretarias$.set(of([]));
      if (orgaoId) {
        this.getSecretarias();
      }
    });

    this.form.get('vehicleId')?.valueChanges.subscribe((vehicleId) => {
      this.form.patchValue({ driverId: null }, { emitEvent: false });
      this.drivers$.set(of([]));
      if (vehicleId) {
        this.getDrivers(vehicleId);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.update.set(true);
      this.form.patchValue({ id });

      this.travelService.getTravel(Number(id)).subscribe((travel) => {
        this.travel.set(travel);
        this.form.patchValue({
          vehicleId: travel.vehicleId,
          driverId: travel.driverId,
          origin: travel.origin,
          destination: travel.destination,
          departureDate: travel.departureDate,
          returnDate: travel.returnDate,
          odometerDeparture: travel.odometerDeparture,
          odometerEntry: travel.odometerEntry,
          prefeituraId: travel.prefeituraId,
          orgaoId: travel.orgaoId,
          secretariaId: travel.secretariaId,          
          distanceKm: travel.distanceKm,
          distanceMeters: travel.distanceMeters,
          travelTime: travel.travelTime,
        });
      });
      // Integração com API de viagens pendente
    }
    this.initMap();
    this.configurarAutocomplete();
  }

  private configurarAutocomplete(): void {
    // Escuta a digitação no campo Origem
    this.form.get('origin')?.valueChanges.pipe(
      debounceTime(400), // Aguarda 400ms para não poluir a API enquanto digita rápido
      distinctUntilChanged(),
      filter(val => typeof val === 'string' && val.length >= 3), // Só busca a partir de 3 letras
      switchMap(texto => this.buscarSugestoes(texto))
    ).subscribe(res => this.sugestoesOrigem = res);

    // Escuta a digitação no campo Destino
    this.form.get('destination')?.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter(val => typeof val === 'string' && val.length >= 3),
      switchMap(texto => this.buscarSugestoes(texto))
    ).subscribe(res => this.sugestoesDestino = res);
  }

  // Busca sugestões com foco no Brasil (countrycodes=br)
  private buscarSugestoes(texto: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&addressdetails=1&limit=5&countrycodes=br`;
    return this.http.get<any[]>(url);
  }

  // Como o Angular Material deve exibir o objeto selecionado no campo de texto
  displayFn(local: any): string {
    return local && local.display_name ? local.display_name : (local || '');
  }

  // Ao clicar em uma opção de Origem na lista
  onSelecionarOrigem(event: any): void {
    const local = event.option.value;
    this.coordsOrigem = { lat: parseFloat(local.lat), lng: parseFloat(local.lon) };

    // Atualiza o campo apenas com a string do endereço
    const enderecoTexto = local.display_name;
    this.form.patchValue({ origin: enderecoTexto }, { emitEvent: false });
    this.calcularViagem();
  }

  // Ao clicar em uma opção de Destino na lista
  onSelecionarDestino(event: any): void {
    const local = event.option.value;
    this.coordsDestino = { lat: parseFloat(local.lat), lng: parseFloat(local.lon) };

    // Atualiza o campo apenas com a string do endereço
    const enderecoTexto = local.display_name;
    this.form.patchValue({ destino: enderecoTexto }, { emitEvent: false });
    this.calcularViagem();
  }

  private initMap(): void {
    // Inicializa o mapa centralizado no Brasil
    this.map = L.map('mapa-osm').setView([-23.55052, -46.633308], 10);

    // Carrega as imagens (tiles) gratuitas do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  async calcularViagem(): Promise<void> {
    // const origemTexto = this.form.get('origin')?.value as string;
    // const destinoTexto = this.form.get('destination')?.value as string;

    // if (!origemTexto || !destinoTexto) return;

    // // 1. Converter endereços em coordenadas (Geocoding via Nominatim)
    // const coordsOrigem = await this.geocodificar(origemTexto);
    // const coordsDestino = await this.geocodificar(destinoTexto);
    if (!this.coordsOrigem || !this.coordsDestino) return;

    const coordsOrigem = this.coordsOrigem;
    const coordsDestino = this.coordsDestino;

    if (!coordsOrigem || !coordsDestino) {
      alert('Endereço de origem ou destino não encontrado.');
      return;
    }

    // 2. Traçar a Rota e Calcular Distância via OSRM (Open Source Routing)
    const urlOsrm = `https://router.project-osrm.org/route/v1/driving/${coordsOrigem.lng},${coordsOrigem.lat};${coordsDestino.lng},${coordsDestino.lat}?overview=full&geometries=geojson`;

    this.http.get<any>(urlOsrm).subscribe(response => {
      if (response.routes && response.routes.length > 0) {
        const rota = response.routes[0];
        
        // Dados recebidos
        const metros = rota.distance; // Distância em metros
        const segundos = rota.duration; // Tempo em segundos
        const km = (metros / 1000).toFixed(1);
        const minutos = Math.round(segundos / 60);

        // Atualiza formulário
        this.form.patchValue({
          distanceKm: `${km} km`,
          distanceMeters: Math.round(metros),
          travelTime: `${minutos} min`
        });

        // 3. Desenhar a linha no Mapa
        this.desenharRotaNoMapa(rota.geometry, coordsOrigem, coordsDestino);
      }
    });
  }

  // Busca coordenadas (Lat/Lng) a partir do texto do endereço
  private geocodificar(endereco: string): Promise<{ lat: number; lng: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`;
    return this.http.get<any[]>(url).toPromise().then(res => {
      if (res && res.length > 0) {
        return { lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) };
      }
      return null;
    });
  }

  private desenharRotaNoMapa(geometry: any, origem: { lat: number; lng: number }, destino: { lat: number; lng: number }): void {
    // Limpa rota anterior se existir
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }

    // Adiciona a linha da rota
    this.routeLayer = L.geoJSON(geometry, {
      style: { color: '#1a237e', weight: 5, opacity: 0.8 }
    }).addTo(this.map);

    // Ajusta o zoom do mapa para mostrar a rota inteira
    const bounds = L.latLngBounds([
      [origem.lat, origem.lng],
      [destino.lat, destino.lng]
    ]);
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  getPrefeituras() {
    this.prefeituraService.getPrefeituras(0, 1000).subscribe((prefeituras) => {
      this.prefeituras$.set(of(prefeituras.data));
      this.cdr.detectChanges();
    });
  }

  getOrgaos() {
    const prefeituraId = this.form.get('prefeituraId')?.value;
    if (!prefeituraId) {
      this.orgaos$.set(of([]));
      return;
    }

    this.prefeituraService.getOrgaosByPrefeituraId(prefeituraId).subscribe((orgaos) => {
      this.orgaos$.set(of(orgaos));
      this.cdr.detectChanges();
    });
  }

  getSecretarias() {
    const orgaoId = this.form.get('orgaoId')?.value;
    if (!orgaoId) {
      this.secretarias$.set(of([]));
      return;
    }

    this.prefeituraService.getSecretariaByOrgaoId(orgaoId).subscribe((secretarias) => {
      this.secretarias$.set(of(secretarias));
      this.cdr.detectChanges();
    });
  }

  getVehicles() {
    this.vehicles$.set(
      this.vehicleService.getAllVehicles(0, 10000).pipe(map((vehicles) => vehicles.data as Vehicle[]))
    );
  }

  getDrivers(vehicleId: number) {
    if (!vehicleId) {
      this.drivers$.set(of([]));
      return;
    }

    this.drivers$.set(
      this.vehicleService.getDriversByVehicleId(vehicleId).pipe(map((drivers) => drivers as Driver[]))
    );
  }

  cancelar() {
    this.router.navigate(['/travels']);
  }

  salvar() {
    if (this.form.get('vehicleId')?.errors?.['required']) {
      this.snackBar.open('Veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverId')?.errors?.['required']) {
      this.snackBar.open('Motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('origin')?.errors?.['required']) {
      this.snackBar.open('Origem é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('destination')?.errors?.['required']) {
      this.snackBar.open('Destino é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('departureDate')?.errors?.['required']) {
      this.snackBar.open('Data de saída é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('status')?.errors?.['required']) {
      this.snackBar.open('Status é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('prefeituraId')?.errors?.['required']) {
      this.snackBar.open('Prefeitura é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('orgaoId')?.errors?.['required']) {
      this.snackBar.open('Órgão é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('secretariaId')?.errors?.['required']) {
      this.snackBar.open('Secretaria é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('odometerDeparture')?.errors?.['required']) {
      this.snackBar.open('Odômetro de saída é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.update()) {
      
      this.updateTravel();
    } else {
      this.createTravel();
      
    }    
 
  }  

  private createTravel() {
    const dataForm = { ...this.form.value };
    this.travelService.createTravel(dataForm as Travel).subscribe({
      next: (travel) => {
        this.snackBar.open('Viagem criada com sucesso', 'Fechar', { duration: 3000 });
        this.travel.set(travel);
        this.router.navigate(['/travels']);
      },
      error: (error) => {
        console.error('Erro ao criar viagem:', error);
        this.snackBar.open('Erro ao criar viagem ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateTravel() {
    const dataForm = { ...this.form.value, id: this.travel()?.id };
    this.travelService.updateTravel(dataForm as Travel).subscribe({
      next: (travel) => {
        this.snackBar.open('Viagem atualizada com sucesso', 'Fechar', { duration: 3000 });
        this.travel.set(travel);
        this.router.navigate(['/travels']);
      },
      error: (error) => {
        console.error('Erro ao atualizar viagem:', error);
        this.snackBar.open('Erro ao atualizar viagem ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  ngAfterViewInit() {
    this.carregarScriptGoogleMaps()
    .then(() => {
      this.apiCarregada.set(true);
      // Garante que o DOM já conhece os inputs antes de ligar o Autocomplete
      setTimeout(() => this.inicializarAutocomplete(), 100);
    })
    .catch(err => console.error('Erro ao carregar mapa:', err));
  }

  inicializarAutocomplete() {
    const origemNative = this.inputOrigemEl()?.nativeElement;
    const destinoNative = this.inputDestinoEl()?.nativeElement;

    if (!origemNative || !destinoNative) return;

    // Autocomplete Origem
    const autocompleteOrigem = new google.maps.places.Autocomplete(origemNative, {
      fields: ['formatted_address'],
      types: ['geocode']
    });
    autocompleteOrigem.addListener('place_changed', () => {
      const place = autocompleteOrigem.getPlace();
      this.origem.set(place.formatted_address || '');
    });

    // Autocomplete Destino
    const autocompleteDestino = new google.maps.places.Autocomplete(destinoNative, {
      fields: ['formatted_address'],
      types: ['geocode']
    });
    autocompleteDestino.addListener('place_changed', () => {
      const place = autocompleteDestino.getPlace();
      this.destino.set(place.formatted_address || '');
    });
  }

  calcularRota() {
    if (!this.origem() || !this.destino()) return;

    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: this.origem(),
      destination: this.destino(),
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsResults.set(result);
        
        // Certificando-se de que a perna da rota existe antes de ler as propriedades
        const rota = result.routes?.[0]?.legs?.[0];
        if (rota) {
          this.distancia.set(rota.distance?.text || '');
          this.duracao.set(rota.duration?.text || '');
        }
      } else {
        // Resetar os estados de forma limpa sem injetar propriedades na string de erro
        this.directionsResults.set(undefined);
        this.distancia.set('');
        this.duracao.set('');
        
        // Tratando a string de status de forma amigável
        this.exibirErroDeRota(status as google.maps.DirectionsStatus);
      }
    });
  }

  private exibirErroDeRota(status: google.maps.DirectionsStatus) {
    const mensagens: Record<string, string> = {
      'NOT_FOUND': 'Pelo menos um dos endereços informados não foi encontrado.',
      'ZERO_RESULTS': 'Não foi possível encontrar uma rota terrestre entre a origem e o destino.',
      'MAX_WAYPOINTS_EXCEEDED': 'Muitos pontos de parada foram informados.',
      'INVALID_REQUEST': 'A requisição enviada ao mapa é inválida.',
      'OVER_QUERY_LIMIT': 'Limite de requisições excedido na chave da API.',
      'REQUEST_DENIED': 'A ativação da API de rotas foi negada no console do Google Cloud.',
      'UNKNOWN_ERROR': 'Erro desconhecido no servidor do Google Maps. Tente novamente.'
    };
  
    const erroAmigavel = mensagens[status] || `Erro ao calcular rota: ${status}`;
    alert(erroAmigavel);
  }
  private carregarScriptGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Se a biblioteca já existir no escopo global, resolve imediatamente
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://googleapis.com?key=' + this.CHAVE_DO_GOOGLE_MAPS + '&libraries=places';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }
  
}
