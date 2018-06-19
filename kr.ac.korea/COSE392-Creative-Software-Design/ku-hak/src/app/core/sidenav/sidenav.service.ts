import { Injectable, OnDestroy } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Injectable()
export class SidenavService implements OnDestroy {
    private _sidenav: MatSidenav | null = null;
    private routerEventsSubscription: Subscription;

    constructor(private router: Router) {
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            this.close();
        });
    }

    ngOnDestroy(): void {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }

    setSidenav(sidenav: MatSidenav): void {
        this._sidenav = sidenav;
    }

    toggle(): Promise<MatDrawerToggleResult | null> {
        if (!this._sidenav) {
            return Promise.resolve(null);
        }

        return this._sidenav.toggle();
    }

    close(): Promise<MatDrawerToggleResult | null> {
        if (!this._sidenav) {
            return Promise.resolve(null);
        }

        return this._sidenav.close();
    }
}
