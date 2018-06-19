import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserNotification } from '../../auth/models';


export interface UserNotificationWithId extends UserNotification {
    id: string;
}


@Component({
    selector: 'hak-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
    @Input() notifications: UserNotificationWithId[];

    constructor(
        private fireStore: AngularFirestore,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
    }

    clickNotification(notification: UserNotificationWithId): void {
        if (!notification.readed) {
            this.fireStore
                .collection<UserNotification>('notifications')
                .doc(notification.id)
                .update({ readed: true });
        }

        this.router.navigate([notification.link]);
    }

}
