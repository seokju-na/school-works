import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';
import { Observable, Subscription } from 'rxjs';
import { filter, map, share, switchMap, take, tap } from 'rxjs/operators';
import { UserNotification } from '../../auth/models';
import { UserNotificationWithId } from '../notifications/notifications.component';
import { SidenavService } from '../sidenav/sidenav.service';


@Component({
    selector: 'hak-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
    user: Observable<User | null>;
    showNotifications = false;
    notifications: Observable<UserNotificationWithId[]>;
    unreadNotificationCount: Observable<number>;

    initialLoading = true;

    private routerEventsSubscription: Subscription;

    constructor(
        private fireAuth: AngularFireAuth,
        private fireStore: AngularFirestore,
        private sidenav: SidenavService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.user = this.fireAuth.user.pipe(share());
        this.notifications = this.fireAuth.user.pipe(
            take(1),
            filter(user => !!user),
            switchMap(user => this._notifications(user.uid)),
        );
        this.unreadNotificationCount = this.fireAuth.user.pipe(
            take(1),
            filter(user => !!user),
            switchMap(user =>
                this._notifications(user.uid).pipe(
                    map(notifications => notifications.reduce(
                        (sum, noti) => !noti.readed ? sum + 1 : sum,
                        0,
                    )),
                    tap(() => this.initialLoading = false),
                ),
            ),
            share(),
        );

        this.routerEventsSubscription = this.router.events.subscribe(() => {
            this.showNotifications = false;
        });
    }

    ngOnDestroy(): void {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }

    clickSidenavToggleButton(): void {
        this.sidenav.toggle();
    }

    toggleNotificationsWindow(): void {
        this.showNotifications = !this.showNotifications;
    }

    private _notifications(uid: string): Observable<UserNotificationWithId[]> {
        return this.fireStore
            .collection<UserNotification>('notifications', ref =>
                ref.where('user.uid', '==', uid).orderBy('createdDatetime'),
            )
            .snapshotChanges()
            .pipe(
                map(actions => actions.map((action) => {
                    const data = action.payload.doc.data() as UserNotification;
                    const id = action.payload.doc.id;

                    return { id, ...data };
                })),
            );
    }
}
