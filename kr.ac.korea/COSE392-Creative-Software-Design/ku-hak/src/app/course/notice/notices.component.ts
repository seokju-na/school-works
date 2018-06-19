import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CourseService } from '../course.service';
import { CourseNotice } from '../models';


@Component({
    selector: 'hak-course-notices',
    templateUrl: './notices.component.html',
    styleUrls: ['./notices.component.less'],
})
export class CourseNoticesComponent implements OnInit {
    myNotices: Observable<CourseNotice[]>;
    loading = true;

    constructor(private courseService: CourseService) {
    }

    ngOnInit(): void {
        this.myNotices = this.courseService.myNotices().pipe(
            tap(() => this.loading = false),
        );
    }
}
