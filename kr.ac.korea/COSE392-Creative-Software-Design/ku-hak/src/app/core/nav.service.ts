import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router/src/router';


@Injectable()
export class NavService {
    private _redirectionUrl: string | null = null;

    constructor(
        private location: Location,
        private router: Router,
    ) {
    }

    get redirectionUrl(): string {
        return this._redirectionUrl;
    }

    setRedirectionUrl(url: string): void {
        this._redirectionUrl = url;
    }

    back(extras?: NavigationExtras): void {
        if (this._redirectionUrl) {
            this.router.navigateByUrl(this._redirectionUrl, extras);
        } else {
            this.location.back();
        }
    }
}
