import { RouterModule, Routes } from '@angular/router';
import { HeaderLayoutTypes } from '../core/models';
import { AuthGuard } from './guards';
import { AuthLoginComponent } from './login/login.component';
import { AuthMyPageEmailVerificationComponent } from './my-page/email-verification.component';
import { AuthMyPageComponent } from './my-page/my-page.component';
import { AuthUserMetadataResolver, AuthUserResolver } from './resolvers';
import { AuthSignUpComponent } from './sign-up/sign-up.component';


export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: AuthLoginComponent,
        data: {
            headerLayout: HeaderLayoutTypes.NAV,
            headerTitle: '로그인',
        },
    },
    {
        path: 'sign-up',
        component: AuthSignUpComponent,
        data: {
            headerLayout: HeaderLayoutTypes.NAV,
            headerTitle: '회원가입',
        },
    },
    {
        path: 'my-page',
        component: AuthMyPageComponent,
        canActivate: [AuthGuard],
        resolve: {
            user: AuthUserResolver,
            userMetadata: AuthUserMetadataResolver,
        },
    },
    {
        path: 'email-verification',
        component: AuthMyPageEmailVerificationComponent,
    },
];


export const AuthRoutingModule = RouterModule.forChild(AUTH_ROUTES);
