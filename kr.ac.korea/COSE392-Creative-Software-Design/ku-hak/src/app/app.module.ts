import { registerLocaleData } from '@angular/common';
import localeKo from '@angular/common/locales/ko';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AUTH_GUARDS } from './auth/guards';
import { AUTH_RESOLVERS } from './auth/resolvers';
import { CoreModule } from './core/core.module';
import { COURSE_GUARDS } from './course/guards';
import { COURSE_RESOLVERS } from './course/resolvers';
import { SharedModule } from './shared/shared.module';


registerLocaleData(localeKo, 'ko');


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'ko' },
        ...AUTH_GUARDS,
        ...AUTH_RESOLVERS,
        ...COURSE_GUARDS,
        ...COURSE_RESOLVERS,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
