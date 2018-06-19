import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';
import { environment } from '../../../environments/environment';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { LoadingDialog } from '../../shared/loading-dialog/loading-dialog';
import { UserMetadata } from '../models';


@Component({
    selector: 'hak-auth-my-page',
    templateUrl: './my-page.component.html',
    styleUrls: ['./my-page.component.less'],
})
export class AuthMyPageComponent implements OnInit {
    profileUpdateForm: FormGroup;
    readonly user: User;
    userMetadata: UserMetadata;

    constructor(
        private fireAuth: AngularFireAuth,
        private fireStore: AngularFirestore,
        private activatedRoute: ActivatedRoute,
        private loadingDialog: LoadingDialog,
        private confirmDialog: ConfirmDialog,
        private snackBar: MatSnackBar,
    ) {

        this.user = this.activatedRoute.snapshot.data.user;
        this.userMetadata = this.activatedRoute.snapshot.data.userMetadata;
    }

    ngOnInit(): void {
        this.profileUpdateForm = new FormGroup({
            name: new FormControl(this.userMetadata.name),
            department: new FormControl(this.userMetadata.department),
            studentNumber: new FormControl(this.userMetadata.studentNumber),
        });
    }

    updateAvatar(avatarPath: string): void {
        const data = {
            ...this.userMetadata,
            avatarPath,
        };

        this.fireStore
            .collection('userMetadata')
            .doc<UserMetadata>(this.user.uid)
            .set(data)
            .then(() => {
                this.userMetadata = data;
                this.snackBar.open('프로필 사진을 변경하였습니다.');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateProfile(): void {
        const data = {
            ...this.userMetadata,
            ...this.profileUpdateForm.value,
        };

        this.fireStore
            .collection('userMetadata')
            .doc(this.user.uid)
            .set(data)
            .then(() => {
                this.userMetadata = data;
                this.snackBar.open('프로필 정보를 업데이트 하였습니다.');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    verifyEmail(): void {
        const url = `${environment.url}/auth/email-verification/?email=${this.user.email}`;
        const verifyEmailTask = this.fireAuth.auth.currentUser.sendEmailVerification({ url });

        this.loadingDialog
            .openWithTask(verifyEmailTask)
            .subscribe((result) => {
                if (result.error) {
                    this.handleVerifyEmailFail(result.error);
                } else {
                    this.confirmDialog.open({
                        title: '이메일 인증 메일 전송',
                        content: '본인 이메일로 인증 메일을 전송하였습니다. 확인해주세요.',
                        isAlert: true,
                    });
                }
            });
    }

    private handleVerifyEmailFail(error: any): void {
        // TODO: 'error' 값에 따라 핸들링 필요

        this.snackBar.open('메일 인증 중에 오류가 발생하였습니다.');
    }

}
