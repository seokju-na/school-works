import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CourseAssignmentsComponent } from './assignment/assignments.component';
import { CourseAssignmentItemComponent } from './assignment/item.component';
import { CourseAssignmentSubmitComponent } from './assignment/submit.component';
import { CourseChatService } from './chat/chat.service';
import { CourseRoutingModule } from './course-routing.module';
import { CourseService } from './course.service';
import { CourseDetailComponent } from './detail/detail.component';
import { CourseHomeComponent } from './home/home.component';
import { CourseNoticeItemComponent } from './notice/item.component';
import { CourseNoticesComponent } from './notice/notices.component';
import { CourseTimeTableComponent } from './time-table/time-table.component';
import { CourseItemComponent } from './item/item.component';
import { CourseListComponent } from './list/list.component';
import { CourseChatRoomComponent } from './chat/chat-room.component';


@NgModule({
    imports: [
        SharedModule,
        CourseRoutingModule,
    ],
    providers: [
        CourseService,
        CourseChatService,
    ],
    declarations: [
        CourseHomeComponent,
        CourseTimeTableComponent,
        CourseAssignmentItemComponent,
        CourseNoticeItemComponent,
        CourseNoticesComponent,
        CourseAssignmentSubmitComponent,
        CourseDetailComponent,
        CourseItemComponent,
        CourseListComponent,
        CourseChatRoomComponent,
        CourseAssignmentsComponent,
    ],
})
export class CourseModule {
}
