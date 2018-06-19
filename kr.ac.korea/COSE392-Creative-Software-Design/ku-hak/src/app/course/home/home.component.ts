import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagingService } from '../../core/messaging.service';
import { CourseService } from '../course.service';
import { CourseNotice, CourseUserAssignment } from '../models';


@Component({
    selector: 'hak-course-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
})
export class CourseHomeComponent implements OnInit {
    myNotices: Observable<CourseNotice[]>;
    myAssignments: Observable<CourseUserAssignment[]>;

    loadingMyNotices = true;
    loadingMyAssignments = true;

    constructor(
        private courseService: CourseService,
        private messagingService: MessagingService,
    ) {
    }

    ngOnInit(): void {
        this.messagingService.initialize();
        this.myNotices = this.courseService.myNotices(3).pipe(
            tap(() => this.loadingMyNotices = false),
        );
        this.myAssignments = this.courseService.myAssignments(3).pipe(
            tap(() => this.loadingMyAssignments = false),
        );
    }

}
