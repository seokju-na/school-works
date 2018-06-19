import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { UserMetadata } from './models';


@Injectable()
export class AuthUserResolver implements Resolve<User> {
    constructor(private fireAuth: AngularFireAuth) {
    }

    resolve(): Observable<User> {
        return this.fireAuth.user.pipe(take(1));
    }
}


@Injectable()
export class AuthUserMetadataResolver implements Resolve<UserMetadata> {
    constructor(
        private fireAuth: AngularFireAuth,
        private fireStore: AngularFirestore,
    ) {
    }

    resolve(): Observable<UserMetadata> {
        return this.fireAuth.user.pipe(
            take(1),
            switchMap(user =>
                this.fireStore
                    .doc<UserMetadata>(`userMetadata/${user.uid}`)
                    .valueChanges()
                    .pipe(
                        take(1),
                        map(data => data ? data : {
                            name: '',
                            department: '',
                            studentNumber: '',
                        }),
                    ),
            ),
        );
    }
}


export const AUTH_RESOLVERS = [
    AuthUserResolver,
    AuthUserMetadataResolver,
];
