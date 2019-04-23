import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpcService } from './ipc.service';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  cart$: Subject<any[]>;
  cart: any[];
  cartTotal:number;
  cartTotal$: Observable<number>;
  activeUser: Member;
  activeUser$: Subject<Member>;

  constructor( private ipc: IpcService, private request: RequestService) {
    this.cart = [];
    this.cart$ = new Subject<any[]>();
    
    this.cartTotal$ = this.cart$.pipe(
      map( cart => {
        let total = 0;
        if (cart && cart.length > 0) {
          cart.forEach(item => {
            total += (item.price * item.amount);
          });
        }
        this.cartTotal = total;
        return total;
      })
    );
    
    this.activeUser$ = new Subject<Member>();
    
    this.ipc.on('rfid', (uuid)=>{
      console.log(uuid);
      this.request.getCard(uuid).then((cards:any) => {
        if(cards.length <= 0 ) return false;
        const card = cards[0];
        console.log(card && card['used_by']);
        if(card && card['used_by']){
          const user = card['used_by'];
          this.setActiveUser(user);
        }
      })
    })
  }
  
  emptyCart(){
    this.cart = [];
    this.cart$.next([]);
  }

  addToCart(item: Item) {
    const exists = this.cart.find( x => x.name === item.name );
    if (exists) {
      exists.amount++;
    } else {
      this.cart.push({ ...item, amount: 1 });
    }
    this.cart$.next(this.cart);
  }

  removeFromCart(item: Item){
    const exists = this.cart.find( x => x.name === item.name );
    if (exists) {
      if (exists.amount > 1) {
         exists.amount--;
      } else {
        const index = this.cart.indexOf(exists);
        this.cart.splice(index, 1);
      } 
      this.cart$.next(this.cart);
    }
  }

  setActiveUser(member){
    this.activeUser = member;
    this.activeUser$.next(member);
  }

  logoutActiveUser(){
    this.activeUser = undefined;
    this.activeUser$.next(undefined);
    this.emptyCart();
  }

  async dummyRfid(){
    this.ipc.demoRfid();
    console.log( await this.request.getLatestTransactionByUserId(23));
  }

}
