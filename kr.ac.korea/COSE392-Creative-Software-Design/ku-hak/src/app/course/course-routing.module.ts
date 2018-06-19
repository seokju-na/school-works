import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards';
import { CourseAssignmentsComponent } from './assignment/assignments.component';
import { CourseAssignmentSubmitComponent } from './assignment/submit.component';
import { CourseDetailComponent } from './detail/detail.component';
import { CourseHomeComponent } from './home/home.component';
import { CourseListComponent } from './list/list.component';
import { CourseNoticesComponent } from './notice/notices.component';
import { CourseAssignmentResolver, CourseUserResolver } from './resolvers';


export const COURSE_ROUTES: Routes = [
    {
        path: 'home',
        component: CourseHomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list',
        component: CourseListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'notices',
        component: CourseNoticesComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'assignments',
        component: CourseAssignmentsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'assignment/:id',
        component: CourseAssignmentSubmitComponent,
        canActivate: [AuthGuard],
        resolve: {
            assignment: CourseAssignmentResolver,
        },
    },
    {
        path: 'detail/:courseNumber',
        component: CourseDetailComponent,
        canActivate: [AuthGuard],
        resolve: {
            course: CourseUserResolver,
        },
    },
];


export const CourseRoutingModule = RouterModule.forChild(COURSE_ROUTES);
