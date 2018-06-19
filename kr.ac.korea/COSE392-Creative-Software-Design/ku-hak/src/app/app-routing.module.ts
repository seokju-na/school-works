import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './core/intro/intro.component';
import { CourseHomeRedirectionGuard } from './course/guards';


export const APP_ROUTES: Routes = [
    {
        path: '',
        component: IntroComponent,
        canActivate: [CourseHomeRedirectionGuard],
    },
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule',
    },
    {
        path: 'course',
        loadChildren: './course/course.module#CourseModule',
    },
];


export const AppRoutingModule = RouterModule.forRoot(APP_ROUTES);
