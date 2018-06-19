import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgForm,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { ErrorStateMatcher, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingDialog } from '../../shared/loading-dialog/loading-dialog';
import { AuthWelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';


const passwordMatchValidator: ValidatorFn = (form: FormGroup): ValidationErrors => {
    const isEmptyValue = (value: string) => value === null || value.length === 0;

    const password = form.get('password').value;
    const passwordConfirm = form.get('passwordConfirm').value;

    if (isEmptyValue(password) || isEmptyValue(passwordConfirm)) {
        return null;
    }

    return password !== passwordConfirm
        ? { passwordNotMatched: true }
        : null;
};


class ParentErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const controlTouched = control && (control.dirty || control.touched);
        const controlInvalid = control && control.invalid;
        const parentInvalid = control
            && control.parent
            && control.parent.invalid
            && (control.parent.dirty || control.parent.touched);

        return (controlTouched && (controlInvalid || parentInvalid));
    }
}


@Component({
    selector: 'hak-auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.less'],
})
export class AuthSignUpComponent implements OnInit {
    signUpForm = new FormGroup({
        email: new FormControl('', [
            Validators.required, Validators.max(30)]),
        passwords: new FormGroup({
            password: new FormControl('', [
                Validators.required, Validators.min(6), Validators.max(30)]),
            passwordConfirm: new FormControl('', [
                Validators.required,
            ]),
        }, { validators: passwordMatchValidator }),
    });

    parentErrorStateMatcher = new ParentErrorStateMatcher();
    redirectUrl: string | null = null;

    constructor(
        private fireAuth: AngularFireAuth,
        private dialog: MatDialog,
        private loadingDialog: LoadingDialog,
        private snackBar: MatSnackBar,
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

    getEmailInputErrorMessage(): string {
        const emailCtrl = this.signUpForm.get('email');

        if (emailCtrl.hasError('required')) {
            return '이메일을 입력해주세요';
        } else if (emailCtrl.hasError('max')) {
            return '이메일이 너무 길어요';
        }

        return '';
    }

    getPasswordInputErrorMessage(): string {
        const passwordCtrl = this.signUpForm.get('passwords.password');

        if (passwordCtrl.hasError('required')) {
            return '비밀번호를 입력해주세요';
        } else if (passwordCtrl.hasError('min')
            || passwordCtrl.hasError('max')) {
            return '비밀번호는 6자 이상 30자 이하입니다';
        }

        return '';
    }

    getPasswordConfirmInputErrorMessage(): string {
        const passwordConfirmCtrl = this.signUpForm.get('passwords.passwordConfirm');

        if (passwordConfirmCtrl.hasError('required')) {
            return '비밀번호를 입력해주세요';
        }

        return '';
    }

    signUp(): void {
        const email = this.signUpForm.get('email').value;
        const password = this.signUpForm.get('passwords.password').value;

        const signUpTask = this.fireAuth.auth.createUserWithEmailAndPassword(
            `${email}@korea.ac.kr`,
            password,
        );

        this.loadingDialog
            .openWithTask(signUpTask)
            .subscribe((result) => {
                if (result.error) {
                    this.handleLoginFail(result.error);
                } else {
                    this.handleLoginSuccess();
                }
            });
    }

    private handleLoginSuccess(): void {
        this.dialog
            .open(AuthWelcomeDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '70vh',
            })
            .afterClosed()
            .subscribe(() => {
                const extras: NavigationExtras = {
                    replaceUrl: true,
                };

                if (this.redirectUrl) {
                    this.router.navigateByUrl(this.redirectUrl, extras);
                } else {
                    this.router.navigate(['/course/home'], extras);
                }
            });
    }

    private handleLoginFail(error: any): void {
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
            this.snackBar.open('이미 사용 중인 이메일입니다', '');
        } else if (errorCode === 'auth/invalid-email') {
            this.snackBar.open('유효하지 않은 이메일입니다', '');
        } else if (errorCode === 'auth/weak-password') {
            this.snackBar.open('비밀번호가 너무 쉬워요', '');
        } else {
            this.snackBar.open('알 수 없는 오류가 발생하였습니다 :(', '');
        }
    }
}
