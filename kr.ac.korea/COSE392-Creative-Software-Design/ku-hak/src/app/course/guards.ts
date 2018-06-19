import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';


@Injectable()
export class CourseHomeRedirectionGuard implements CanActivate {
    constructor(
        private fireAuth: AngularFireAuth,
        private router: Router,
    ) {
    }

    canActivate(): Observable<boolean> {
        return this.fireAuth.authState.pipe(
            take(1),
            tap((user) => {
                if (user) {
                    this.router.navigate(['/course/home'], {
                        replaceUrl: true,
                        queryParamsHandling: 'preserve',
                    });
                }
            }),
            map(user => user === null),
        );
    }
}


export const COURSE_GUARDS = [
    CourseHomeRedirectionGuard,
];
