import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
    CourseAssignmentStatus,
    courseAssignmentStatusNameMap,
    CourseAssignmentTypes,
    CourseUserAssignment,
} from '../models';


@Component({
    selector: 'hak-course-assignment-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseAssignmentItemComponent {
    @Input() assignment: CourseUserAssignment;

    constructor(private sanitizer: DomSanitizer) {
    }

    get typeName(): string {
        switch (this.assignment.assignment.type) {
            case CourseAssignmentTypes.TEAM:
                return '팀과제';
            case CourseAssignmentTypes.PERSONAL:
                return '개인과제';
        }

        return '';
    }

    get statusName(): string {
        return courseAssignmentStatusNameMap[this.assignment.status];
    }

    get statusColor(): string {
        switch (this.assignment.status) {
            case CourseAssignmentStatus.PENDING:
                return 'accent';
            case CourseAssignmentStatus.EXPIRED:
                return 'warn';
            case CourseAssignmentStatus.SUBMITTED:
                return 'primary';
        }

        return '';
    }

    get content(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.assignment.assignment.content);
    }

    canSubmit(): boolean {
        return this.assignment.status === CourseAssignmentStatus.PENDING;
    }
}
