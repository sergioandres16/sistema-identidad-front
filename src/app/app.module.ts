import {ApplicationRef, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ErrorInterceptorService } from './core/interceptors/error-interceptor.service';

@NgModule({
  declarations: [
    // AppComponent is standalone, so it should NOT be declared here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,

    // Import standalone components instead of declaring them
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ]
})
export class AppModule {
  constructor(private applicationRef: ApplicationRef) {
    const componentRef = document.querySelector('app-root');
    if (componentRef) {
      this.applicationRef.bootstrap(AppComponent);
    }
  }
}
