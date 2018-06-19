import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { IntroComponent } from './intro/intro.component';
import { MessagingService } from './messaging.service';
import { NavService } from './nav.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavService } from './sidenav/sidenav.service';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
    imports: [
        SharedModule,
        MatSidenavModule,
        RouterModule,
    ],
    declarations: [
        SidenavComponent,
        HeaderComponent,
        IntroComponent,
        NavHeaderComponent,
        NotificationsComponent,
    ],
    providers: [
        SidenavService,
        NavService,
        MessagingService,
    ],
    exports: [
        MatSidenavModule,
        SidenavComponent,
        HeaderComponent,
        NavHeaderComponent,
        IntroComponent,
    ],
})
export class CoreModule {
}
