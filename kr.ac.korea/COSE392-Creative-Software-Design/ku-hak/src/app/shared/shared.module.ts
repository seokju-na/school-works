import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MAT_SNACK_BAR_DEFAULT_OPTIONS,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { LoadingDialog } from './loading-dialog/loading-dialog';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        A11yModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatTableModule,
        MatBadgeModule,
        MatExpansionModule,
        MatTooltipModule,
        MatChipsModule,
        MatSelectModule,
        MatTabsModule,
    ],
    declarations: [
        ConfirmDialogComponent,
        LoadingDialogComponent,
        FileUploaderComponent,
    ],
    entryComponents: [
        ConfirmDialogComponent,
        LoadingDialogComponent,
    ],
    exports: [
        CommonModule,
        A11yModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatTableModule,
        MatBadgeModule,
        MatExpansionModule,
        MatTooltipModule,
        MatChipsModule,
        MatSelectModule,
        MatTabsModule,
        ConfirmDialogComponent,
        LoadingDialogComponent,
        FileUploaderComponent,
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                {
                    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
                    useValue: { duration: 2500 },
                },
                LoadingDialog,
                ConfirmDialog,
            ],
        };
    }
}
