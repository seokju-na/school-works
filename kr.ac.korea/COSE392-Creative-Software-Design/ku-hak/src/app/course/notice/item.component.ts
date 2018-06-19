import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CourseNotice } from '../models';


@Component({
    selector: 'hak-course-notice-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseNoticeItemComponent {
    @Input()
    get notice() {
        return this._notice;
    }
    set notice(value) {
        this._notice = value;
        this.setContent();
    }

    private _notice: CourseNotice;

    @ViewChild('content') contentEl: ElementRef;

    private setContent(): void {
        if (this.contentEl) {
            this.contentEl.nativeElement.innerHTML = this._notice.content;
        }
    }
}
