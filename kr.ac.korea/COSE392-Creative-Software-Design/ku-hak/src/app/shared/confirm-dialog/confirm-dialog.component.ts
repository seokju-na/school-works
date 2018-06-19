import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';


export interface ConfirmDialogData {
    title?: string;
    content: string;
    isAlert?: boolean;
}


@Component({
    selector: 'hak-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) readonly data: ConfirmDialogData,
    ) {
    }

    ngOnInit(): void {
    }

}
