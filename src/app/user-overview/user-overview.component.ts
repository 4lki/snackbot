import { Component, ViewChild } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { RequestService } from '../request.service';
import { from, Observable, VirtualTimeScheduler } from 'rxjs';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { CommonService } from '../common.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent {
 
  members: Observable<any[]>;
  dataSource: MatTableDataSource<Member>;
  displayedColumns: string[] = ['first_name', 'last_name', 'team'];
  display = 'list';
  @ViewChild(MatSort) sort: MatSort;

  constructor(private breakpointObserver: BreakpointObserver, private request: RequestService, private common: CommonService, private dialog:MatDialog) {
    this.members = from(this.request.getMembers());
    this.members.subscribe(data => {
      console.log(data)
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
    
  }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openDialog(){
      const dialogRef = this.dialog.open( DialogComponent, {data: {dialog: 'AddUser'}})
    }

}
