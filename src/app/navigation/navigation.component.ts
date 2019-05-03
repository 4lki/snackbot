import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { ActivatedRoute, Router, RouterOutlet, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  links = [
    {route: '/drinks', pretty: 'Drinks'},
    {route: '/snacks', pretty: 'Snacks'},
    //{route: '/users', pretty: 'User', auth:true}
  ]
  activeLink = this.links[0];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver, 
    public common: CommonService,
    private router: Router) {
      this.router.events.subscribe(event => {
        if(event instanceof NavigationEnd)
        this.activeLink = this.links.find(link => link.route == event.url)
      })
  }

}
