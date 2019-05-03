import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpcService } from './ipc.service';
import { RequestService } from './request.service';
import { Router } from '@angular/router';

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

  constructor( private ipc: IpcService, private request: RequestService, private router:Router) {
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
    let last_uuid = '';
    this.ipc.on('rfid', (uuid)=>{
      if (uuid != last_uuid){
        this.request.getCard(uuid).then((cards:any) => {
          if(cards.length <= 0 ) return false;
          const card = cards[0];
          console.log(card && card['used_by']);
          if(card && card['used_by']){
            const user = card['used_by'];
            this.setActiveUser(user);
          }
        })
      }
    })
  }
  
  emptyCart(){
    this.cart = [];
    this.cart$.next([]);
  }

  isAdmin(){
    if(!this.activeUser) {return false}
    if(this.activeUser.status == "staff"){
      return true;
    }
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
    member.balance = member.transactions[member.transactions.length -1].total || 0;
    this.activeUser = member;
    this.activeUser$.next(member);
  }

  logoutActiveUser(){
    this.activeUser = undefined;
    this.activeUser$.next(undefined);
    this.emptyCart();
    this.router.navigateByUrl('/');

  }


}
