import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';


@Component({
    selector: 'hak-auth-welcome-dialog',
    templateUrl: './welcome-dialog.component.html',
    styleUrls: ['./welcome-dialog.component.less'],
})
export class AuthWelcomeDialogComponent implements OnInit {
    user: Observable<User>;

    constructor(private fireAuth: AngularFireAuth) {
    }

    ngOnInit() {
        this.user = this.fireAuth.user;
    }

}
