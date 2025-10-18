import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeliveryAddressRequest } from '../../../../../../../../core/models/order.model';
import { MapsLoaderService } from '../../../../../../../../core/services/maps-loader.service';
import { NotificationService } from '../../../../../../../../core/services/notification.service';
import { AddressFormComponent } from '../../../address-form/address-form.component';

@Component({
  selector: 'app-delivery-mode',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    AddressFormComponent,
  ],
  templateUrl: './delivery-mode.component.html',
  styleUrl: './delivery-mode.component.scss',
})
export class DeliveryModeComponent implements OnDestroy {
  @Output() next = new EventEmitter<{
    deliveryAddress: DeliveryAddressRequest;
  }>();
  @Output() back = new EventEmitter<void>();

  @ViewChild('mapContainer', { static: false })
  mapContainer?: ElementRef<HTMLDivElement>;

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

  map!: google.maps.Map | null;
  marker!: google.maps.marker.AdvancedMarkerElement | null;
  geocoder!: google.maps.Geocoder;
  deliveryZonePolygon!: google.maps.Polygon;
  isMarkerInsideZone = true;
  mapReady = false;
  loading = false;

  private deliveryZoneCoords = [
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

  constructor(
    private mapsLoader: MapsLoaderService,
    private notificationService: NotificationService,
    private zone: NgZone
  ) {
    this.loadMapApi();
  }

  ngOnDestroy(): void {
    if (this.map) this.map = null;
    if (this.marker) this.marker = null;
    if (this.deliveryZonePolygon) this.deliveryZonePolygon.setMap(null);
  }

  async loadMapApi() {
    try {
      this.loading = true;
      await this.mapsLoader.load();
      this.zone.run(() => (this.mapReady = true));
      setTimeout(() => this.initMap(), 300);
    } catch (e) {
      console.error('Error cargando Google Maps', e);
      this.notificationService.error('Error', 'No se pudo cargar Google Maps');
    } finally {
      this.loading = false;
    }
  }

  async initMap() {
    if (!this.mapContainer) return;

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

    this.geocoder = new Geocoder();
    const initialPosition = {
      lat: this.currentDeliveryAddress.latitude,
      lng: this.currentDeliveryAddress.longitude,
    };

    this.map = new Map(this.mapContainer.nativeElement, {
      center: initialPosition,
      zoom: 15,
      mapId: '1c59fed56e5a2316c4e1b308',
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

    this.marker.addListener('dragend', () => {
      const newPos = this.marker!.position as google.maps.LatLngLiteral;
      this.currentDeliveryAddress.latitude = newPos.lat;
      this.currentDeliveryAddress.longitude = newPos.lng;
      this.checkMarkerInsideZone(newPos);
      if (this.isMarkerInsideZone) this.geocodePosition(newPos);
      else this.resetAddress();
    });

    this.checkMarkerInsideZone(initialPosition);
    if (this.isMarkerInsideZone) this.geocodePosition(initialPosition);
  }

  private checkMarkerInsideZone(position: google.maps.LatLngLiteral) {
    this.isMarkerInsideZone = google.maps.geometry.poly.containsLocation(
      position,
      this.deliveryZonePolygon
    );
  }

  private geocodePosition(pos: google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location: pos }, (results: any, status: string) => {
      if (status === 'OK' && results[0]) {
        const comp = results[0].address_components;
        const addr = this.parseAddress(comp);
        this.currentDeliveryAddress = {
          ...this.currentDeliveryAddress,
          ...addr,
        };
      }
    });
  }

  private parseAddress(components: any[]): Partial<DeliveryAddressRequest> {
    const addr: any = {};
    let street = '';
    let num = '';
    for (const c of components) {
      if (c.types.includes('route')) street = c.long_name;
      if (c.types.includes('street_number')) num = c.long_name;
      if (c.types.includes('locality')) addr.city = c.long_name;
      if (c.types.includes('administrative_area_level_1'))
        addr.province = c.long_name;
      if (c.types.includes('postal_code')) addr.zipCode = c.long_name;
    }
    addr.street = `${street} ${num}`.trim();
    return addr;
  }

  private resetAddress() {
    this.currentDeliveryAddress = {
      ...this.currentDeliveryAddress,
      street: '',
      city: '',
      province: '',
      zipCode: '',
    };
  }

  onAddressFormChange(data: Partial<DeliveryAddressRequest>) {
    this.currentDeliveryAddress = { ...this.currentDeliveryAddress, ...data };
  }

  onNext() {
    if (!this.isMarkerInsideZone) {
      this.notificationService.warn('Fuera de zona de reparto');
      return;
    }
    this.next.emit({ deliveryAddress: this.currentDeliveryAddress });
  }
}
