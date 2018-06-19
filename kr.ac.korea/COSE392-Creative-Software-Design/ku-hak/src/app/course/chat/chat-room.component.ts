import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Course, CourseChat, CourseUser } from '../models';
import { CourseChatService } from './chat.service';


@Component({
    selector: 'hak-course-chat-room',
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.less'],
})
export class CourseChatRoomComponent implements OnInit {
    @Input() course: Course;
    @Input() user: { uid: string; name: string };

    @ViewChild('chatListEl') chatListEl: ElementRef;

    isProfessor: boolean;
    students: Observable<{ uid: string; name: string }[]>;
    currentStudent: { uid: string; name: string };
    chats: Observable<CourseChat[]>;
    title: string;
    step: 'studentSelect' | 'chat';
    expanded = false;

    messageForm = new FormGroup({
        message: new FormControl(''),
    });

    constructor(
        private fireStore: AngularFirestore,
        private chatService: CourseChatService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit(): void {
        this.isProfessor = this.course.professor.uid === this.user.uid;

        if (this.isProfessor) {
            this.students = this._students;
            this.step = 'studentSelect';
        } else {
            this.currentStudent = { ...this.user };
            this.chatService.openRoom(this.course, this.user.uid);
            this.chats = this.chatService.chats.pipe(tap(() => this.scrollBottom()));
            this.title = this.course.professor.name;
            this.step = 'chat';
        }
    }

    backToStudentSelect(): void {
        this.step = 'studentSelect';
    }

    openStudentChatRoom(student: { uid: string; name: string }): void {
        this.currentStudent = { ...student };
        this.chatService.openRoom(this.course, student.uid);
        this.chats = this.chatService.chats.pipe(tap(() => this.scrollBottom()));
        this.title = this.currentStudent.name;
        this.step = 'chat';
    }

    makeChat(): void {
        if (this.emptyMessage()) {
            return;
        }

        const message = this.messageForm.get('message').value;

        this.chatService.makeChat(
            this.course,
            { ...this.currentStudent },
            { ...this.user },
            message,
        );
        this.messageForm.get('message').setValue('');
    }

    toggleExpanded(): void {
        this.expanded = !this.expanded;
    }

    emptyMessage(): boolean {
        return this.messageForm.get('message').value === '';
    }

    isMyChat(chat: CourseChat): boolean {
        return chat.sentUser.uid === this.user.uid;
    }

    getParseMessage(chat: CourseChat): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(chat.message);
    }

    private get _students(): Observable<{ uid: string; name: string }[]> {
        return this.fireStore
            .collection<CourseUser>('courseUsers', ref =>
                ref
                    .where('course.number', '==', this.course.number)
                    .orderBy('user.name'),
            )
            .valueChanges()
            .pipe(map((courseUsers) =>
                courseUsers
                    .filter(courseUser =>
                        courseUser.user.uid !== this.course.professor.uid,
                    )
                    .map(courseUser => ({
                        uid: courseUser.user.uid,
                        name: courseUser.user.name,
                    })),
            ));
    }

    private scrollBottom(): void {
        setTimeout(() => {
            if (this.chatListEl) {
                const elem = this.chatListEl.nativeElement;

                elem.scrollTop = elem.scrollHeight;
            }
        });
    }

}
