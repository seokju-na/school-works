import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { messaging } from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable()
export class MessagingService implements OnDestroy {
    private readonly _messaging: messaging.Messaging;
    private readonly _messages = new BehaviorSubject(null);

    constructor(
        private fireStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
        private snackBar: MatSnackBar,
    ) {

        try {
            this._messaging = messaging();
        } catch (err) {
            console.error(err);
        }

        if (this._messaging) {
            this._messaging.usePublicVapidKey(environment.publicVapidKey);
            this._messaging.onMessage((payload) => {
                this._messages.next(payload);
            });
        }
    }

    ngOnDestroy(): void {
        this._messages.complete();
    }

    initialize(): void {
        if (!this._messaging) {
            return;
        }

        this._messaging
            .getToken()
            .then((token) => {
                if (!token) {
                    this.requestPermission();
                } else {
                    this.updateToken(token);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateToken(token: string): void {
        this.fireAuth.authState
            .pipe(take(1))
            .subscribe((user) => {
                if (user) {
                    this.fireStore.doc(`fcmTokens/${user.uid}`).set({ token });
                }
            });
    }

    messages(): Observable<any> {
        return this._messages.asObservable();
    }

    requestPermission(): void {
        if (!this._messaging) {
            return;
        }

        const snackBarRef = this.snackBar.open(
            '알림을 수신하시겠습니까?',
            '알림 설정',
            { duration: 0 },
        );

        snackBarRef.onAction().subscribe(() => {
            this._messaging
                .requestPermission()
                .then(() => {
                    this.initialize();
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }
}
