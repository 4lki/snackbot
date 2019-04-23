import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { CommonService } from '../common.service';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  constructor(private common: CommonService ) { }

  ngOnInit() {
  }
  addToCart(item){
    this.common.addToCart(item)
  }
}
