import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserMetadata } from '../../auth/models';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';


@Component({
    selector: 'hak-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.less'],
})
export class SidenavComponent implements OnInit {
    user: Observable<User | null>;
    userMetadata: Observable<UserMetadata | null>;
    hasAvatar = false;
    avatarImageUrl: Observable<string>;
    serviceLinks = [
        { name: '내 수업', link: '/course/list' },
        { name: '전체 공지사항', link: '/course/notices' },
        { name: '내 과제', link: '/course/assignments' },
        { name: '내 성적', link: '/' },
        { name: '강의 평가 보기', link: '/' },
    ];

    constructor(
        private fireAuth: AngularFireAuth,
        private fireStore: AngularFirestore,
        private fireStorage: AngularFireStorage,
        private router: Router,
        private confirmDialog: ConfirmDialog,
    ) {
    }

    ngOnInit(): void {
        this.user = this.fireAuth.user;
        this.fireAuth.authState.subscribe((user) => {
            if (!user) {
                return;
            }

            this.userMetadata = this.fireStore
                .doc<UserMetadata>(`userMetadata/${user.uid}`)
                .valueChanges()
                .pipe(
                    map(data => data
                        ? data
                        : {
                            name: user.displayName,
                            department: '-',
                            studentNumber: '-',
                        },
                    ),
                    tap(data => this.applyAvatar(data)),
                );
        });
    }

    logout(): void {
        this.confirmDialog
            .open({
                title: '로그아웃',
                content: '정말로 로그아웃 하시겠어요?',
            })
            .afterClosed()
            .pipe(
                switchMap((confirmed) => {
                    if (confirmed) {
                        return fromPromise(this.fireAuth.auth.signOut())
                            .pipe(tap(() => {
                                this.router.navigate(['/']);
                            }));
                    }

                    return of(null);
                }),
            )
            .subscribe();
    }

    private applyAvatar(metadata: UserMetadata): void {
        if (metadata.avatarPath) {
            this.avatarImageUrl = this.fireStorage.ref(metadata.avatarPath).getDownloadURL();
            this.hasAvatar = true;
        } else {
            this.hasAvatar = false;
        }
    }

}
