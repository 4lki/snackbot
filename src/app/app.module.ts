import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { ItemOverviewComponent } from './item-overview/item-overview.component';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { MatTableModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatSortModule, MatTabsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CartComponent } from './cart/cart.component';
import { ItemComponent } from './item/item.component';
import { DialogComponent } from './dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { IpcService } from './ipc.service';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ItemComponent,
    ItemOverviewComponent,
    UserOverviewComponent,
    NavigationComponent,
    CartComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    FlexLayoutModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'de-DE',
  },
  IpcService
],
  entryComponents:[
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
