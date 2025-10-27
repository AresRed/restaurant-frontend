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
    { lng: -75.724211, lat: -14.088629 },
    { lng: -75.72155, lat: -14.081553 },
    { lng: -75.721807, lat: -14.080138 },
    { lng: -75.719147, lat: -14.079555 },
    { lng: -75.719404, lat: -14.07431 },
    { lng: -75.711851, lat: -14.07048 },
    { lng: -75.715714, lat: -14.061322 },
    { lng: -75.720606, lat: -14.062737 },
    { lng: -75.721807, lat: -14.060906 },
    { lng: -75.723524, lat: -14.055244 },
    { lng: -75.722065, lat: -14.054078 },
    { lng: -75.722322, lat: -14.047834 },
    { lng: -75.727987, lat: -14.049582 },
    { lng: -75.727386, lat: -14.055411 },
    { lng: -75.730219, lat: -14.055827 },
    { lng: -75.73245, lat: -14.045086 },
    { lng: -75.735369, lat: -14.043254 },
    { lng: -75.742922, lat: -14.045835 },
    { lng: -75.744896, lat: -14.049582 },
    { lng: -75.746613, lat: -14.052247 },
    { lng: -75.751076, lat: -14.053246 },
    { lng: -75.751419, lat: -14.056826 },
    { lng: -75.749424, lat: -14.060885 },
    { lng: -75.744681, lat: -14.060198 },
    { lng: -75.744081, lat: -14.065735 },
    { lng: -75.743351, lat: -14.067858 },
    { lng: -75.742664, lat: -14.073228 },
    { lng: -75.744424, lat: -14.073894 },
    { lng: -75.743866, lat: -14.07739 },
    { lng: -75.747728, lat: -14.078598 },
    { lng: -75.746484, lat: -14.082177 },
    { lng: -75.742064, lat: -14.082843 },
    { lng: -75.74142, lat: -14.083967 },
    { lng: -75.738716, lat: -14.083842 },
    { lng: -75.738029, lat: -14.085299 },
    { lng: -75.736656, lat: -14.085258 },
    { lng: -75.734167, lat: -14.085008 },
    { lng: -75.733867, lat: -14.085924 },
    { lng: -75.735369, lat: -14.086298 },
    { lng: -75.734982, lat: -14.089129 },
    { lng: -75.731335, lat: -14.088962 },
    { lng: -75.731893, lat: -14.084425 },
    { lng: -75.729704, lat: -14.08634 },
    { lng: -75.724211, lat: -14.088629 },
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

  private createMarker(pos: google.maps.LatLngLiteral) {
    const { AdvancedMarkerElement } = (google.maps as any)
      .marker as google.maps.MarkerLibrary;
    this.marker = new AdvancedMarkerElement({
      position: pos,
      map: this.map!,
      gmpDraggable: true,
    });

    this.marker.addListener('dragend', () => {
      const newPos = this.marker!.position as google.maps.LatLngLiteral;
      this.currentDeliveryAddress.latitude = newPos.lat;
      this.currentDeliveryAddress.longitude = newPos.lng;
      this.checkMarkerInsideZone(newPos);
      if (this.isMarkerInsideZone) {
        this.geocodePosition(newPos);
      } else {
        this.notificationService.warn('Fuera de zona de reparto');
        this.resetAddress();
      }
    });
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
