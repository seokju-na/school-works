import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingDialog } from '../../shared/loading-dialog/loading-dialog';


@Component({
    selector: 'hak-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
})
export class AuthLoginComponent implements OnInit {
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });
    redirectUrl: string | null = null;

    constructor(
        private fireAuth: AngularFireAuth,
        private snackBar: MatSnackBar,
        private loadingDialog: LoadingDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        const { snapshot } = this.activatedRoute;

        if (snapshot.queryParams.redirectUrl) {
            this.redirectUrl = snapshot.queryParams.redirectUrl;
        }
    }

    login(): void {
        const { email, password } = this.loginForm.value;
        const loginTask =  this.fireAuth.auth.signInWithEmailAndPassword(
            `${email}@korea.ac.kr`,
            password,
        );

        this.loadingDialog
            .openWithTask(loginTask)
            .subscribe((result) => {
                if (result.error) {
                    this.handleLoginFail(result.error);
                } else {
                    this.handleLoginSuccess();
                }
            });
    }

    private handleLoginSuccess(): void {
        const extras: NavigationExtras = {
            replaceUrl: true,
        };

        if (this.redirectUrl) {
            this.router.navigateByUrl(this.redirectUrl, extras);
        } else {
            this.router.navigate(['/course/home'], extras);
        }
    }

    private handleLoginFail(error: any): void {
        const errorCode = error.code;
        const config = { duration: 2000 };

        if (errorCode === 'auth/user-not-found') {
            this.snackBar.open('일치하는 계정이 없습니다!', '', config);
        } else if (errorCode === 'auth/wrong-password') {
            this.snackBar.open('비밀번호가 틀렸어요', '', config);
        } else if (errorCode === 'auth/user-disabled') {
            this.snackBar.open('계정이 비활성화 상태에요', '', config);
        } else {
            this.snackBar.open('알 수 없는 오류가 발생하였습니다 :(', '', config);
        }
    }

}
