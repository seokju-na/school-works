import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { fromPromise, isPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { LoadingDialogComponent } from './loading-dialog.component';


export interface LoadingDialogResult<T> {
    value: T;
    error: any;
}


@Injectable()
export class LoadingDialog {
    private dialogRef: MatDialogRef<LoadingDialogComponent, LoadingDialogResult<any>> | null = null;
    private innerTaskSubscription: Subscription;

    constructor(private dialog: MatDialog) {
    }

    openWithTask<T = any>(task: Observable<T> | Promise<T>): Observable<LoadingDialogResult<T>> {
        if (this.dialogRef) {
            this.close();
        }

        this.dialogRef = this.dialog.open(LoadingDialogComponent, {
            disableClose: true,
            closeOnNavigation: true,
        });

        if (isPromise(task)) {
            task = fromPromise(task);
        }

        this.innerTaskSubscription = task.subscribe(
            result => this.dialogRef.close({ value: result, error: null }),
            error => this.dialogRef.close({ value: null, error }),
        );

        return this.dialogRef.afterClosed().pipe(
            map(result => result ? result : { value: null, error: null }),
        );
    }

    close(result?: any): void {
        if (this.dialogRef) {
            this.dialogRef.close(result);
        }

        if (this.innerTaskSubscription) {
            this.innerTaskSubscription.unsubscribe();
        }
    }
}
