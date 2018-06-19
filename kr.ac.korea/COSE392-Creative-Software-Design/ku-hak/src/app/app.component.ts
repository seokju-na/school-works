import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import {
    ActivatedRoute,
    Data,
    GuardsCheckStart,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    ResolveStart,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, share } from 'rxjs/operators';
import { MessagingService } from './core/messaging.service';
import { HeaderLayoutTypes } from './core/models';
import { SidenavService } from './core/sidenav/sidenav.service';


@Component({
    selector: 'hak-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('shell') private shellEl: ElementRef;
    @ViewChild(MatSidenav) private sidenav: MatSidenav;
    routeData: Observable<Data>;
    showProgressBar = false;

    HEADER_NAV = HeaderLayoutTypes.NAV;

    constructor(
        private sidenavService: SidenavService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private messagingService: MessagingService,
        private snackBar: MatSnackBar,
    ) {

        this.routeData = this._routeData;

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart
                || event instanceof GuardsCheckStart
                || event instanceof ResolveStart) {
                this.showProgressBar = true;
            }

            if (event instanceof NavigationEnd
                || event instanceof NavigationCancel
                || event instanceof NavigationError) {
                this.showProgressBar = false;
            }

            this.scrollToTop();
        });
    }

    private get _routeData(): Observable<Data> {
        const getChildRoute = () => {
            let route = this.activatedRoute.firstChild;
            let child = route;

            while (child) {
                if (child.firstChild) {
                    child = child.firstChild;
                    route = child;
                } else {
                    child = null;
                }
            }

            return route;
        };

        return this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(getChildRoute),
            mergeMap(route => route.data),
            share(),
        );
    }

    ngOnInit(): void {
        this.messagingService.messages().subscribe((message) => {
            if (message) {
                this.snackBar.open('새로운 알림입니다', '');
            }
        });
    }

    ngAfterViewInit(): void {
        this.sidenavService.setSidenav(this.sidenav);
    }

    private scrollToTop(): void {
        if (this.shellEl) {
            this.shellEl.nativeElement.scrollTop = 0;
        }
    }
}
