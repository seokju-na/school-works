import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NavService } from '../nav.service';


@Component({
    selector: 'hak-nav-header',
    templateUrl: './nav-header.component.html',
    styleUrls: ['./nav-header.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavHeaderComponent implements OnInit {
    @Input() headerTitle: string;

    constructor(private navService: NavService) {
    }

    ngOnInit(): void {
    }

    clickBackButton(): void {
        this.navService.back();
    }
}
