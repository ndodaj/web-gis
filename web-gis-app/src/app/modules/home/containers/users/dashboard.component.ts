import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '@core/utils';
@AutoUnsubscribe
@Component({
  selector: 'app-users',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('dashboard');
  }
}
