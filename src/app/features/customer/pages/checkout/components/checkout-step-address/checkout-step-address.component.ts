import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeliveryAddressRequest } from '../../../../../../core/models/order.model';
import { TableResponse } from '../../../../../../core/models/table.model';
import { MapsLoaderService } from '../../../../../../core/services/maps-loader.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { TableService } from '../../../../../../core/services/restaurant/table.service';
import { AddressFormComponent } from '../address-form/address-form.component';

declare var google: any;

export interface CheckoutStep2Data {
  deliveryAddress?: DeliveryAddressRequest;
  dineIn?: { tableId: number | null };
  takeAway?: { storeId: number | null };
}

@Component({
  selector: 'app-checkout-step-address',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AddressFormComponent,
    InputNumberModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './checkout-step-address.component.html',
  styleUrl: './checkout-step-address.component.scss',
})
export class CheckoutStepAddressComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  private _mapContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('mapContainer') set mapContainerRef(
    elRef: ElementRef<HTMLDivElement> | undefined
  ) {
    if (elRef) {
      this._mapContainerRef = elRef;
      console.log('Div #mapContainer encontrado por ViewChild.');
      this.initializeMapIfNeeded();
    }
  }

  @Input() selectedOrderTypeCode: string = '';
  @Output() next = new EventEmitter<CheckoutStep2Data>();
  @Output() back = new EventEmitter<void>();

  map!: google.maps.Map | null;
  marker!: google.maps.marker.AdvancedMarkerElement | null;
  geocoder!: google.maps.Geocoder;
  deliveryZoneCoords = [
    { lat: -14.0663821, lng: -75.7398385 },
    { lat: -14.0713358, lng: -75.7383365 },
    { lat: -14.0761229, lng: -75.738079 },
    { lat: -14.0819506, lng: -75.7301826 },
    { lat: -14.0797028, lng: -75.7204408 },
    { lat: -14.0747492, lng: -75.7235307 },
    { lat: -14.0713774, lng: -75.7245178 },
    { lat: -14.069296, lng: -75.7251615 },
    { lat: -14.069296, lng: -75.7257623 },
    { lat: -14.0629685, lng: -75.7276506 },
    { lat: -14.0663821, lng: -75.7398385 },
  ];
  deliveryZonePolygon!: google.maps.Polygon;
  isMarkerInsideZone = true;
  mapReady = false;
  apiLoading = false;
  mapInitialized = false;

  currentDeliveryAddress: DeliveryAddressRequest = {
    latitude: -14.0674,
    longitude: -75.7286,
    street: '',
    city: '',
    province: '',
    zipCode: '',
    reference: '',
    instructions: '',
  };

  availableTables: TableResponse[] = [];
  selectedTable: TableResponse | null = null;
  tablesLoading = false;

  private mapInstanceListener: google.maps.MapsEventListener | null = null;

  constructor(
    private tableService: TableService,
    private notificationService: NotificationService,
    private mapsLoader: MapsLoaderService,
    private zone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOrderTypeCode']) {
      const typeCode = changes['selectedOrderTypeCode'].currentValue;
      this.resetStepState();

      if (typeCode === 'DINE_IN') {
        this.destroyMap();
        this.loadAvailableTables();
      } else if (typeCode === 'DELIVERY') {
        this.loadMapApiIfNeeded();
      } else {
        this.destroyMap();
      }
    }
  }

  async ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.destroyMap();
  }

  private resetStepState(): void {
    this.selectedTable = null;
    this.isMarkerInsideZone = true;
  }

  private destroyMap(): void {
    console.log('Intentando destruir mapa...');
    if (this.mapInstanceListener) {
      google.maps.event.removeListener(this.mapInstanceListener);
      this.mapInstanceListener = null;
      console.log('Listener del marcador eliminado.');
    }
    if (this.marker) {
      this.marker.map = null;
      this.marker = null;
      console.log('Marcador eliminado del mapa.');
    }
    if (this.deliveryZonePolygon) {
      this.deliveryZonePolygon.setMap(null);
      console.log('Polígono eliminado del mapa.');
    }
    if (this.map) {
      this.map = null;
      console.log('Referencia al mapa eliminada.');
    }
  }

  private async loadMapApiIfNeeded() {
    if (this.mapReady || this.apiLoading) {
      return;
    }
    this.apiLoading = true;
    try {
      console.log('Cargando Google Maps API...');
      await this.mapsLoader.load();
      console.log('Google Maps API cargada.');

      this.zone.run(() => {
        this.mapReady = true;

        this.initializeMapIfNeeded();
      });
    } catch (error) {
      console.error('Fallo al cargar Google Maps API:', error);
      this.notificationService.error(
        'Error',
        'No se pudo cargar el servicio de mapas.'
      );
      this.zone.run(() => {
        this.mapReady = false;
        this.apiLoading = false;
      });
    } finally {
      this.zone.run(() => {
        this.apiLoading = false;
      });
    }
  }

  private async initializeMapIfNeeded() {
    if (
      this.isDelivery() &&
      this.mapReady &&
      this._mapContainerRef &&
      !this.map
    ) {
      console.log('API lista y Div encontrado, llamando a initMap...');
      await this.initMap(this._mapContainerRef.nativeElement);
    } else if (this.mapReady && this.map) {
      const currentPos = this.marker?.position || {
        lat: this.currentDeliveryAddress.latitude,
        lng: this.currentDeliveryAddress.longitude,
      };
      this.checkMarkerPosition(currentPos as google.maps.LatLngLiteral);
      if (this.isMarkerInsideZone) {
        this.geocodeLatLng(currentPos as google.maps.LatLngLiteral);
      }
    } else {
      console.log('initializeMapIfNeeded: Condiciones NO cumplidas.', {
        isDelivery: this.isDelivery(),
        mapReady: this.mapReady,
        hasMapContainer: !!this.mapContainerRef?.nativeElement,
        mapExists: !!this.map,
      });
    }
  }

  private async initMap(mapDivElement: HTMLDivElement) {
    console.log('Initializing map...');

    if (!google || !google.maps) {
      console.error('Error crítico: El objeto base google.maps no existe.');
      this.notificationService.error(
        'Error',
        'No se pudo cargar la base de Google Maps.'
      );
      this.destroyMap();
      return;
    }

    try {
      const { Map, Polygon } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;
      const { Geocoder } = (await google.maps.importLibrary(
        'geocoding'
      )) as google.maps.GeocodingLibrary;
      await google.maps.importLibrary('geometry');

      console.log('Librerías importadas correctamente.');

      if (!google.maps.geometry || !google.maps.geometry.poly) {
        throw new Error(
          'La librería google.maps.geometry.poly no se cargó correctamente.'
        );
      }

      this.geocoder = new Geocoder();
      const initialPosition = {
        lat: this.currentDeliveryAddress.latitude,
        lng: this.currentDeliveryAddress.longitude,
      };

      this.map = new Map(mapDivElement, {
        center: initialPosition,
        zoom: 15,
        mapId: 'YOUR_CUSTOM_MAP_ID',
        mapTypeControl: false,
        streetViewControl: false,
      });

      this.deliveryZonePolygon = new Polygon({
        paths: this.deliveryZoneCoords,
        strokeColor: '#007BFF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#007BFF',
        fillOpacity: 0.1,
        map: this.map,
      });

      this.marker = new AdvancedMarkerElement({
        position: initialPosition,
        map: this.map,
        gmpDraggable: true,
      });

      if (this.mapInstanceListener)
        google.maps.event.removeListener(this.mapInstanceListener);

      this.checkMarkerPosition(initialPosition);

      if (this.isMarkerInsideZone) {
        this.geocodeLatLng(initialPosition);
      } else {
        this.updateAddressFromForm({
          street: '',
          city: '',
          province: '',
          zipCode: '',
        });
      }

      this.marker?.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        this.zone.run(() => {
          const newPosition = this.marker!
            .position as google.maps.LatLngLiteral;
          this.currentDeliveryAddress.latitude = newPosition.lat;
          this.currentDeliveryAddress.longitude = newPosition.lng;

          this.checkMarkerPosition(newPosition);

          if (this.isMarkerInsideZone) this.geocodeLatLng(newPosition);
          else
            this.updateAddressFromForm({
              street: '',
              city: '',
              province: '',
              zipCode: '',
            });
        });
      });

      this.checkMarkerPosition(initialPosition);
      if (this.isMarkerInsideZone) this.geocodeLatLng(initialPosition);
      else
        this.updateAddressFromForm({
          street: '',
          city: '',
          province: '',
          zipCode: '',
        });

      console.log('Map initialized successfully.');
      
    } catch (error) {
      console.error('Error durante la inicialización del mapa:', error);
      this.notificationService.error(
        'Error',
        'No se pudieron inicializar los componentes del mapa.'
      );
      this.destroyMap();
    }
  }

  private checkMarkerPosition(position: google.maps.LatLngLiteral) {
    if (!google?.maps?.geometry?.poly) {
      console.warn('checkMarkerPosition: geometry.poly no disponible.');
      this.isMarkerInsideZone = true;
      return;
    }
    try {
      this.isMarkerInsideZone = google.maps.geometry.poly.containsLocation(
        position,
        this.deliveryZonePolygon
      );
    } catch (e) {
      console.error('Error en containsLocation:', e);
      this.isMarkerInsideZone = true;
    }
  }

  private geocodeLatLng(position: { lat: number; lng: number }) {
    this.geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results![0]) {
        const address = this.parseAddressComponents(
          results![0].address_components
        );

        this.currentDeliveryAddress = {
          ...this.currentDeliveryAddress,
          street: address.street,
          city: address.city,
          province: address.province,
          zipCode: address.zipCode,
        };
      } else {
        console.error('Geocoder falló debido a: ' + status);
        this.updateAddressFromForm({
          street: '',
          city: '',
          province: '',
          zipCode: '',
        });
      }
    });
  }

  private parseAddressComponents(
    components: google.maps.GeocoderAddressComponent[]
  ): Partial<DeliveryAddressRequest> {
    const address: Partial<DeliveryAddressRequest> = {};
    let streetNumber = '';
    let route = '';

    for (const component of components) {
      const types = component.types;
      if (types.includes('street_number')) streetNumber = component.long_name;
      if (types.includes('route')) route = component.long_name;
      if (types.includes('locality')) address.city = component.long_name;
      if (types.includes('administrative_area_level_1'))
        address.province = component.long_name;
      if (types.includes('postal_code')) address.zipCode = component.long_name;
    }
    address.street = `${route} ${streetNumber}`.trim();
    return address;
  }

  updateAddressFromForm(formData: Partial<DeliveryAddressRequest>) {
    this.currentDeliveryAddress = {
      ...this.currentDeliveryAddress,
      ...formData,
    };
  }

  private loadAvailableTables() {
    this.tablesLoading = true;
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        if (res.success) {
          this.availableTables = res.data.filter(
            (table) => table.status === 'FREE'
          );
        }
        this.tablesLoading = false;
      },
      error: (err) => {
        console.error('Error cargando las mesas', err);
        this.tablesLoading = false;
      },
    });
  }

  selectTable(table: TableResponse) {
    this.selectedTable = table;
  }

  onNext() {
    if (this.isDelivery() && !this.isMarkerInsideZone) {
      this.notificationService.warn(
        'La ubicación seleccionada está fuera de nuestra zona de reparto.'
      );
      return;
    }
    if (this.isDelivery() && !this.currentDeliveryAddress.street) {
      this.notificationService.warn(
        'Por favor, selecciona una ubicación válida en el mapa.'
      );
      return;
    }
    if (this.isDineIn() && !this.selectedTable) {
      this.notificationService.warn(
        'Por favor, selecciona una mesa disponible.'
      );
      return;
    }

    let data: CheckoutStep2Data = {};
    if (this.isDelivery()) {
      data.deliveryAddress = this.currentDeliveryAddress;
    }
    if (this.isDineIn()) {
      data.dineIn = { tableId: this.selectedTable?.id ?? null };
    }

    this.next.emit(data);
  }
  isDelivery = () => this.selectedOrderTypeCode === 'DELIVERY';
  isTakeAway = () => this.selectedOrderTypeCode === 'TAKE_AWAY';
  isDineIn = () => this.selectedOrderTypeCode === 'DINE_IN';
}
