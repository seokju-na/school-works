import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { filter, finalize, map, switchMap } from 'rxjs/operators';
import { FileRef } from '../../core/models';
import { floor10 } from '../../utils/math-extensions';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';


let uniqueId = 0;


@Component({
    selector: 'hak-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.less'],
})
export class FileUploaderComponent implements OnInit {
    readonly inputId: string;

    @Input()
    get fileRef() {
        return this._fileRef;
    }

    set fileRef(value) {
        if (value) {
            this._fileRef = value;
            this.initStorageRef(this._fileRef, true);
        }
    }

    @Input() baseFilePath: string;
    @Input() disabled: boolean;

    @Output() readonly uploaded = new EventEmitter<FileRef>();
    @Output() readonly deleted = new EventEmitter<void>();

    downloadUrl: Observable<string>;
    uploadPercent: Observable<number>;
    uploading = false;

    private _fileRef: FileRef | null = null;
    private storageRef: AngularFireStorageReference;

    constructor(
        private fireStorage: AngularFireStorage,
        private confirmDialog: ConfirmDialog,
    ) {

        this.inputId = `FileUploaded-${uniqueId++}`;
    }

    isFileRefExists(): boolean {
        return !!this._fileRef;
    }

    ngOnInit(): void {
    }

    uploadFile(event: Event): void {
        const file = (<HTMLInputElement>event.target).files[0];

        if (!file || this.disabled) {
            return;
        }

        const filePath = this.baseFilePath
            ? `${this.baseFilePath}/${file.name}`
            : file.name;

        this._fileRef = {
            path: filePath,
            name: file.name,
        };

        this.initStorageRef(this._fileRef);

        const task = this.fireStorage.upload(this._fileRef.path, file);

        this.uploadPercent = task.percentageChanges().pipe(
            map(value => floor10(value)),
        );

        this.uploading = true;

        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    this.uploading = false;
                    this.downloadUrl = this.storageRef.getDownloadURL();
                }),
            )
            .subscribe(
                () => {
                },
                error => this.handleUploadFail(error),
                () => this.handleUploadSuccess(),
            );
    }

    deleteFile(): void {
        if (!this.isFileRefExists()) {
            this.deleted.emit();
            return;
        }

        this.confirmDialog
            .open({
                title: '파일 삭제',
                content: `"${this._fileRef.name}"을 삭제하시곘습니까?`,
            })
            .afterClosed()
            .pipe(
                filter(confirmed => !!confirmed),
                switchMap(() => this.storageRef.delete()),
            )
            .subscribe(
                () => this.handleDeleteSuccess(),
                error => this.handleDeleteFail(error),
            );
    }

    private initStorageRef(fileRef: FileRef, created = false): void {
        this.storageRef = this.fireStorage.ref(fileRef.path);

        if (created) {
            this.downloadUrl = this.storageRef.getDownloadURL();
        }
    }

    private handleUploadSuccess(): void {
        this.uploaded.emit({ ...this._fileRef });
    }

    private handleUploadFail(error: any): void {
    }

    private handleDeleteSuccess(): void {
        this._fileRef = null;
        this.deleted.emit();
    }

    private handleDeleteFail(error: any): void {
    }
}
