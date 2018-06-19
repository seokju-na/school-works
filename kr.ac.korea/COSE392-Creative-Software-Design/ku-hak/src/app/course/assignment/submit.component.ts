import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { FileRef } from '../../core/models';
import { LoadingDialog } from '../../shared/loading-dialog/loading-dialog';
import {
    CourseAssignmentStatus,
    courseAssignmentStatusNameMap,
    CourseAssignmentTypes,
    CoursePersonalAssignment,
    CourseTeamAssignment,
    CourseUserAssignment,
} from '../models';


interface RoleOptionItem {
    displayValue: string;
    value: string;
}


@Component({
    selector: 'hak-course-assignment-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class CourseAssignmentSubmitComponent implements OnInit, AfterViewInit {
    readonly assignment: CourseUserAssignment | any;
    roleModifyForm: FormArray;
    readonly userOptions: RoleOptionItem[];

    @ViewChild('content') contentEl: ElementRef;

    constructor(
        private fireStore: AngularFirestore,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private loadingDialog: LoadingDialog,
    ) {

        this.assignment = activatedRoute.snapshot.data.assignment;

        if (this.assignment.files.length === 0) {
            this.assignment.files.push(null);
        }

        if (this.isTypeTeam()) {
            const userKeys = Object.keys(this.assignment.users);

            this.userOptions = userKeys.map(uid => ({
                displayValue: this.assignment.users[uid].name,
                value: uid,
            }));

            this.userOptions.sort((a, b) => {
                if (a.displayValue > b.displayValue) {
                    return 1;
                } else if (a.displayValue < b.displayValue) {
                    return -1;
                }
                return 0;
            });

            const controls = (<CourseTeamAssignment>this.assignment).roles.map(role =>
                new FormGroup({
                    role: new FormControl(role.role, [Validators.required]),
                    user: new FormControl(role.user.uid, [Validators.required]),
                }),
            );

            this.roleModifyForm = new FormArray(controls);
        }
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

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (this.contentEl) {
            this.contentEl.nativeElement.innerHTML = this.assignment.assignment.content;
        }
    }

    isExpired(): boolean {
        return this.assignment.status === CourseAssignmentStatus.EXPIRED;
    }

    isTypeTeam(): boolean {
        return this.assignment.assignment.type === CourseAssignmentTypes.TEAM;
    }

    uploadFile(index: number, fileRef: FileRef): void {
        this.assignment.files[index] = fileRef;
    }

    deleteFile(index: number): void {
        this.assignment.files.splice(index, 1);
    }

    canAddFile(): boolean {
        return this.assignment.files.length < 5;
    }

    canAddRole(): boolean {
        return (<CourseTeamAssignment>this.assignment).roles.length < 10;
    }

    addFile(): void {
        if (this.canAddFile()) {
            this.assignment.files.push(null);
        }
    }

    addRole(): void {
        if (this.canAddRole()) {
            this.roleModifyForm.push(new FormGroup({
                role: new FormControl('', [Validators.required]),
                user: new FormControl(null, [Validators.required]),
            }));
        }
    }

    removeRole(index: number): void {
        this.roleModifyForm.removeAt(index);
    }

    getRoleModifyControls(): FormGroup[] {
        return this.roleModifyForm.controls as FormGroup[];
    }

    submit(): void {
        if (this.roleModifyForm.invalid) {
            this.snackBar.open('역할을 기입해주세요!', '');
            return;
        }

        const files = this.assignment.files.filter(file => file !== null);
        const patch = {
            files,
            status: CourseAssignmentStatus.SUBMITTED,
        } as Partial<CoursePersonalAssignment>;

        if (this.isTypeTeam()) {
            (<Partial<CourseTeamAssignment>>patch).roles = this.roleModifyForm.value.map((data) => ({
                role: data.role,
                user: this.assignment.users[data.user],
            }));
        }

        const updateTask = this.fireStore
            .collection('courseAssignmentUsers')
            .doc<CourseUserAssignment>(this.assignment.id)
            .update(patch);

        this.loadingDialog
            .openWithTask(updateTask)
            .subscribe(
                () => this.handleUpdateSuccess(),
                error => this.handleUpdateFail(error),
            );
    }

    private handleUpdateSuccess(): void {
        this.assignment.status = CourseAssignmentStatus.SUBMITTED;
        this.snackBar.open('과제가 제출되었습니다.', '');
    }

    private handleUpdateFail(error: any): void {
        console.error(error);
        this.snackBar.open('정보 저장 중에 오류가 발생하였습니다 :(', '');
    }
}
