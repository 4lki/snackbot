import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../common.service';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() member: Member;
  @Input() layout = 'card'; 
  constructor(private request: RequestService) { }

  ngOnInit() {
  }

  getOrders(){
    this.request.getOrders();
  }

}
