import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';


@Injectable()
export class ConfirmDialog {
    private dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>;

    constructor(private dialog: MatDialog) {
    }

    open(data: ConfirmDialogData): MatDialogRef<ConfirmDialogComponent, boolean> {
        if (this.dialogRef) {
            this.close();
        }

        this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
            maxWidth: '65vw',
            width: '250px',
            disableClose: false,
            closeOnNavigation: true,
            data,
        });

        return this.dialogRef;
    }

    close(confirmed: boolean = false): void {
        if (this.dialogRef) {
            this.dialogRef.close(confirmed);
        }
    }
}
