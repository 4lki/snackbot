import { Component } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { RequestService } from '../request.service';
import { Observable, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-overview',
  templateUrl: './item-overview.component.html',
  styleUrls: ['./item-overview.component.css']
})
export class ItemOverviewComponent {

  items: Observable<Item[]>;
  collectionName: string;
  constructor(private breakpointObserver: BreakpointObserver, private request: RequestService, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if(data && data.collection){
        this.collectionName = data.collection;
        this.items = from(this.request.getItems(data.collection)).pipe(tap(x=>console.log(x)));
      }
    });
  }
}
