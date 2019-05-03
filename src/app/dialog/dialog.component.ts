import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RequestService } from '../request.service';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  public dialog:string;
  user: any; 
  teams :any;
  data: any;
  percentage$: Observable<number>;
  startTime: number;
  waittime = 100;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    public request:RequestService,
    public common: CommonService
  ){
    this.data = data || {};
    this.dialog = this.data.dialog || 'Load';
    
    if(this.dialog == 'Card'){

      this.percentage$ = interval(1000).pipe(
        map(x => {
          const percentage = (Date.now() - this.startTime) / this.waittime;
          return percentage
        }));
        
        this.percentage$.subscribe(x => {
          if(x >= 100){
            if(this.common.activeUser == undefined){
              this.dialogRef.close();
            }
          }
        });
        
      this.startTime = Date.now(); 
    }
    if(this.dialog == 'AddUser'){
      this.user = {
        first_name: '',
        last_name: '',
        email: ''
      }
      this.teams = this.request.getTeams();
    }
  }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}
