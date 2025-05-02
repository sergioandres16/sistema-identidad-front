import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app-routing.module';
import { CoreModule } from './app/core/core.module';
import { SharedModule } from './app/shared/shared.module';
import { AuthInterceptorService } from './app/auth/auth-interceptor.service';
import { ErrorInterceptorService } from './app/core/interceptors/error-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      BrowserModule,            // sólo aquí
      BrowserAnimationsModule,
      HttpClientModule,
      CoreModule,
      SharedModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ]
}).catch(err => console.error(err));
