import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { mapTo, mergeMap, take, tap } from 'rxjs/operators';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private fireAuth: AngularFireAuth,
        private router: Router,
        private confirmDialog: ConfirmDialog,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {

        return this.fireAuth.authState.pipe(
            take(1),
            mergeMap((user) => {
                if (!user) {
                    return this
                        .askLoginRequired(state.url)
                        .pipe(mapTo(false));
                }

                return of(true);
            }),
        );
    }

    private askLoginRequired(redirectUrl: string): Observable<boolean> {
        return this.confirmDialog
            .open({
                title: '로그인 필요',
                content: '로그인이 필요한 서비스입니다. 지금 바로 로그인 페이지로 이동하시겠습니까?',
            })
            .afterClosed()
            .pipe(tap((confirmed) => {
                if (confirmed) {
                    this.router.navigate(['/auth/login'], {
                        queryParams: { redirectUrl },
                    });
                } else if (this.router.routerState.snapshot.url === '') {
                    this.router.navigate(['/']);
                }
            }));
    }
}


export const AUTH_GUARDS = [
    AuthGuard,
];
