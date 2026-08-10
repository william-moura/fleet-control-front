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
        });
      });
      // Integração com API de viagens pendente
    }
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
