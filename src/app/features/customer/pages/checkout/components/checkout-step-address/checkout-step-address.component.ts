import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeliveryAddressRequest } from '../../../../../../core/models/order.model';
import { TableResponse } from '../../../../../../core/models/table.model';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { TableService } from '../../../../../../core/services/table.service';
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
export class CheckoutStepAddressComponent implements AfterViewInit, OnChanges {
  @Input() selectedOrderTypeCode: string = '';
  @Output() next = new EventEmitter<CheckoutStep2Data>();
  @Output() back = new EventEmitter<void>();

  map!: google.maps.Map;
  marker!: google.maps.marker.AdvancedMarkerElement;
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

  constructor(
    private tableService: TableService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOrderTypeCode']) {
      this.selectedTable = null;
      this.isMarkerInsideZone = true;

      if (this.isDineIn()) {
        this.loadAvailableTables();
      }
      if (this.isDelivery() && this.map) {
        this.initializeMapIfNeeded();
      }
    }
  }

  async ngAfterViewInit() {
    if (this.isDelivery()) {
      await this.initializeMapIfNeeded();
    }
  }

  private async initializeMapIfNeeded() {
    if (!this.map) {
      await this.initMap();
    } else {
      const currentPos = this.marker?.position || {
        lat: this.currentDeliveryAddress.latitude,
        lng: this.currentDeliveryAddress.longitude,
      };
      this.checkMarkerPosition(currentPos as google.maps.LatLngLiteral);
      if (this.isMarkerInsideZone) {
        this.geocodeLatLng(currentPos as google.maps.LatLngLiteral);
      }
    }
  }

  private async initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    try {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        'marker'
      );
      const { Geocoder } = await google.maps.importLibrary('geocoding');
      const { geometry } = await google.maps.importLibrary('geometry');

      this.geocoder = new Geocoder();
      const initialPosition = {
        lat: this.currentDeliveryAddress.latitude,
        lng: this.currentDeliveryAddress.longitude,
      };
      this.map = new Map(mapDiv, {
        center: initialPosition,
        zoom: 15,
        mapId: 'YOUR_CUSTOM_MAP_ID',
        mapTypeControl: false,
        streeViewControl: false,
      });

      this.deliveryZonePolygon = new google.maps.Polygon({
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

      this.marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        const newPosition = this.marker.position as google.maps.LatLngLiteral;
        this.currentDeliveryAddress.latitude = newPosition.lat;
        this.currentDeliveryAddress.longitude = newPosition.lng;

        this.checkMarkerPosition(newPosition);

        if (this.isMarkerInsideZone) {
          this.geocodeLatLng(newPosition);
        } else {
          this.updateAddressFromForm({
            street: '',
            city: '',
            province: '',
            zipCode: '',
          });
        }
      });
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }

  private checkMarkerPosition(position: google.maps.LatLngLiteral) {
    if (!google?.maps?.geometry?.poly) {
      console.warn('Google Maps Geometry library not loaded yet.');
      this.isMarkerInsideZone = true;
      return;
    }
    this.isMarkerInsideZone = google.maps.geometry.poly.containsLocation(
      position,
      this.deliveryZonePolygon
    );
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
      this.notificationService.warn('La ubicación seleccionada está fuera de nuestra zona de reparto.');
      return;
    }
    if (this.isDelivery() && !this.currentDeliveryAddress.street) {
      this.notificationService.warn('Por favor, selecciona una ubicación válida en el mapa.');
      return;
    }
    if (this.isDineIn() && !this.selectedTable) {
      this.notificationService.warn('Por favor, selecciona una mesa disponible.');
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
