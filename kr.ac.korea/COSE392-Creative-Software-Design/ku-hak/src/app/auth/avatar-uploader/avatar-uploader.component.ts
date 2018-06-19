import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


let uniqueId = 0;


@Component({
    selector: 'hak-auth-avatar-uploader',
    templateUrl: './avatar-uploader.component.html',
    styleUrls: ['./avatar-uploader.component.less'],
})
export class AuthAvatarUploaderComponent implements OnInit {
    @Input()
    get avatarPath() {
        return this._avatarPath;
    }
    set avatarPath(path) {
        if (path && this._avatarPath !== path) {
            this._avatarPath = path;
            this.initStorage(true);
        }
    }

    @Output() readonly updated = new EventEmitter<string>();

    readonly id = `AvatarUploader-${uniqueId++}`;

    avatarImageUrl: Observable<string>;
    uploading = false;

    private _avatarPath: string | null = null;
    private storage: AngularFireStorageReference;

    constructor(
        private fireAuth: AngularFireAuth,
        private fireStorage: AngularFireStorage,
        private snackBar: MatSnackBar,
    ) {
    }

    ngOnInit(): void {
    }

    uploadImage(event: Event): void {
        const file = (<HTMLInputElement>event.target).files[0];

        if (!file) {
            return;
        }

        this._avatarPath = `${this.fireAuth.auth.currentUser.uid}/${file.name}`;
        this.initStorage();

        this.uploading = true;

        this.fireStorage
            .upload(this._avatarPath, file)
            .snapshotChanges()
            .pipe(finalize(() => this.uploading = false))
            .subscribe(
                () => {},
                error => this.handleUploadError(error),
                () => this.handleUploadSuccess(),
            );
    }

    private initStorage(created = false): void {
        this.storage = this.fireStorage.ref(this._avatarPath);

        if (created) {
            this.avatarImageUrl = this.storage.getDownloadURL();
        }
    }

    private handleUploadSuccess(): void {
        this.avatarImageUrl = this.storage.getDownloadURL();
        this.updated.emit(this._avatarPath);
    }

    private handleUploadError(error: any): void {
        console.error(error);
        this.snackBar.open('사진 업로드 도중 오류가 발생하였습니다 :(', '');
    }

}
