import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLoginComponent } from './login/login.component';
import { AuthMyPageEmailVerificationComponent } from './my-page/email-verification.component';
import { AuthSignUpComponent } from './sign-up/sign-up.component';
import { AuthWelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { AuthMyPageComponent } from './my-page/my-page.component';
import { AuthAvatarUploaderComponent } from './avatar-uploader/avatar-uploader.component';


@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
    ],
    entryComponents: [
        AuthWelcomeDialogComponent,
    ],
    declarations: [
        AuthLoginComponent,
        AuthSignUpComponent,
        AuthWelcomeDialogComponent,
        AuthMyPageComponent,
        AuthMyPageEmailVerificationComponent,
        AuthAvatarUploaderComponent,
    ],
})
export class AuthModule {
}
