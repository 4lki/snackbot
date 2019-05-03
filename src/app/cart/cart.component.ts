import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { RequestService } from '../request.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription, timer } from 'rxjs';
import { dialog } from 'electron';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems : Item[];
  cartTotal : number; 
  flag: boolean;

  constructor(public common: CommonService, private request: RequestService, private dialog:MatDialog) { 
    this.common.cartTotal$.subscribe(total => {
      console.log(total);
      this.cartTotal = total;
    })
    this.flag = false;
  }

  ngOnInit() {
      
  }

  async placeOrder(){

    if(this.flag) return false;

    const member = this.common.activeUser;
    if( !member) return false;
        
    const cart = this.common.cart.map( item => {
      return {snack: item.id, amount: item.amount}
    });
    if(cart.length <= 0) return false;
    
    try{
      this.flag = !this.flag;
      
      const cost = this.common.cartTotal;
      let total = 0;
      const transaction_r = await this.request.getLatestTransactionByUserId(member.id);
      if(transaction_r.data && transaction_r.data.length > 0){
        total = transaction_r.data[0].total
      }

      const order_d = {
        'member' : member.id,
        'cart': cart,
        'cost' : cost,
      }
      const order_r = await this.request.createOrder(order_d);

      if(order_r.data){
        const lastId = order_r.data.id;
        const transaction_data = {
          'order': +lastId,
          'amount': -cost,
          'member': member.id,
          'total': total-cost
        }
        const r = await  this.request.createTransaction(transaction_data);
      }

      this.common.logoutActiveUser();

      this.flag = false;  
      return order_r;

    }catch(e){
      this.flag = false;
      console.log(e);
    }
  }

  async checkOrder() {
    let dialogRef;
    
    const placeOrder = async (dialogRef) => {
      dialogRef.componentInstance.dialog = 'Load';
        await this.placeOrder();   
        dialogRef.componentInstance.dialog = 'Confirm';          
        timer(2000).subscribe(x=> {
          dialogRef.close();
        })
    }

    if( this.common.activeUser == undefined ){
      dialogRef = this.dialog.open( DialogComponent, {
        width: '250px',
        data: {dialog: 'Card'}
      });
      const subscription = this.common.activeUser$.subscribe(async user => {
        if(user != undefined){
          placeOrder(dialogRef);
        }
      });
      dialogRef.afterClosed().subscribe( () => {
        subscription.unsubscribe();
      });
      
    }else{
      dialogRef = this.dialog.open( DialogComponent, {
        width: '250px',
        data: {dialog: 'Load'}
      });
      placeOrder(dialogRef);
    }

    

    
  }

  


}
