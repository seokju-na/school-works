import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
    selector: 'hak-auth-my-page-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.less'],
})
export class AuthMyPageEmailVerificationComponent implements OnInit {
    loading = true;
    errorCaught: 'noActionCode' | 'invalidCode' | null = null;

    private readonly mode: string;
    private readonly actionCode: string;

    constructor(
        private fireAuth: AngularFireAuth,
        private activatedRoute: ActivatedRoute,
    ) {

        const { queryParams } = this.activatedRoute.snapshot;

        this.mode = queryParams.mode;
        this.actionCode = queryParams.oobCode;
    }

    ngOnInit(): void {
        if (this.mode !== 'verifyEmail' || !this.actionCode) {
            this.errorCaught = 'noActionCode';
            this.loading = false;
        } else {
            this.applyActionCode();
        }
    }

    private applyActionCode(): void {
        this.fireAuth.auth
            .applyActionCode(this.actionCode)
            .then(() => {
                this.loading = false;
            })
            .catch(() => {
                this.errorCaught = 'invalidCode';
                this.loading = false;
            });
    }
}
