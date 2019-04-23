import { Injectable } from '@angular/core';
import DirectusSDK from '@directus/sdk-js'
import { environment } from 'src/environments/environment';
import { from, Subject, Observable } from 'rxjs';
import { map, tap, debounceTime } from 'rxjs/operators';

enum SnackType{
  NULL, Drinks, Snacks
}
@Injectable({
  providedIn: 'root'
})
export class RequestService {
  client: DirectusSDK;
  debounce: Subject<any>;
  lastCall: number;
  waitTime = 600;

  constructor() { 
    this.client = new DirectusSDK();
    this.debounce = new Subject<any>()
    this.lastCall = Date.now();
  }
  
  login(){
    if(!this.client.loggedIn){
      return this.client.login({
        url: environment.apiUrl,
        project : "_",
        email : environment.login,
        password : environment.password
      })
    }
    return true;
  }

  checkWait(){
    let answer = false;
    if(Date.now() > (this.lastCall + this.waitTime) ){
      answer = true;
    }
    this.lastCall = Date.now();
    return answer;  
  }

  async getItems(type): Promise<Item[]> {
    await this.login();
    /* if(!this.checkWait()) {
      return new Promise<Item[]>( (res, rej) => {
        setTimeout( x => {
          this.getItems(type).then( item => res(item));
        },this.waitTime)
      });
    } */
    return this.client.getItems('Snacks' , {
      fields: '*.*',
      filter: {
        type :{ 
          eq: SnackType[type]
        }
      }
    }).then(res => {
      return res.data.map( x => {
        x.type = type;
        return x;
      });
    });
  }

  async getOrders(): Promise<any[]> {
    await this.login();
    if(!this.checkWait()) return Promise.reject();
    return this.client.getItems('Orders' , {
      fields: '*.*.*'
    }).then( res => {
      console.log(res.data)
    });
  }

  async getMembers(): Promise<any[]> {
    await this.login();
    return this.client.getItems('Members', {
      fields: '*.*'
    }).then(res => res.data);
  }

  async getTeams(): Promise<any[]> {
    await this.login();
    return this.client.getItems('Teams', {
      fields: '*.*'
    }).then(res => res.data);
  }

  async getCard(uuid): Promise<any[]>{
    await this.login();
    return this.client.getItems('Keycards', {
      filter:{
        uuid:{ eq : uuid}
      },
      fields: '*.*'
    }).then(res => res.data);
  }

  async createOrder(order){
    await this.login();      
    return this.client.createItem('Orders', order);
  }

  async createTransaction(transaction){
    await this.login();      
    return this.client.createItem('Transactions', transaction);
  }

  async getLatestTransactionByUserId(id){
    await this.login();
    return this.client.getItems('Transactions', {
      filter: {
        member : {eq : +id}
      },
      limit: 1,
      sort : '-created_on'
    })
  }
}