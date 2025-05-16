import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from 'jeep-sqlite/loader';


defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(), // <-- Standalone correto do Ionic!
    provideRouter(routes)
  ]
})
.catch(err => console.error(err));
