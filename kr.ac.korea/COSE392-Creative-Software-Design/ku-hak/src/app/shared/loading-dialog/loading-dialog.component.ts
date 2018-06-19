import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
    selector: 'hak-loading-dialog',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingDialogComponent {
}
