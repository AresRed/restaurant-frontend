import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { Route } from '@angular/router';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     providePrimeNG({
      theme:{
        preset:Aura,

      },
     }),
     provideAnimations()
    ],
    
};
