import { Injectable, NgZone } from "@angular/core";
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class MapsLoaderService {
  private promise: Promise<void> | undefined;
  private apiKey = environment.googleMapsApiKey;
  private libraries = 'marker,geometry,places,geocoding';

  constructor(private zone: NgZone) {}

  load(): Promise<void> {
    if (this.promise) return this.promise;

    this.promise = new Promise<void>((resolve, reject) => {
      const existing = document.getElementById('google-maps-script');
      if (existing) {
        existing.remove();
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&v=beta&libraries=${this.libraries}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google Maps (v=beta) cargado correctamente');
        this.zone.run(resolve);
      };

      script.onerror = (err) => {
        console.error('❌ Error al cargar Google Maps', err);
        this.promise = undefined;
        this.zone.run(() => reject(err));
      };

      document.head.appendChild(script);
    });

    return this.promise;
  }
}