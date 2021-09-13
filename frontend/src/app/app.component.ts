import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'frontend';

  count = 'aasdf';

  public static Current: AppComponent;

  users: any[] = [];
  Self: any;

  public ws = webSocket('ws://192.168.100.88:8080/');

  username = '';
  selfId = -1;


  ngOnInit(): void {
    AppComponent.Current = this;

    this.ws.subscribe(x => {

      console.log(x);

      let res = x as any;

      if (res.function) {
        if (res.function === 'connected') {
          this.onConnected();
        }

        if (res.data) {
          let data = res.data;

          switch (res.function) {
            case 'login': {
              this.selfId = data.id;
              this.Self = data;
              this.get();
              break;
            }
            case 'get': {
              this.users = data.users as any[];
              break;
            }
            case 'update': {
              for (let i = 0; i< data.users.length; i++) {
                let user = data.users[i];

                console.log(user);

                for (let j = 0; j < this.users.length; j++) {
                  if (this.users[j].id === user.id) {
                    this.users[j] = user;
                  }

                  if (user.id === this.selfId) {
                    this.count = user.count;
                  }
                }
              }
              break;
            }
          }
        }
      }
    });
  }

  onConnected() {
    console.log('connected');

    if (this.selfId > 0) {
      this.get();
    }
  }

  get() {
    let json = {
      function: 'get'
    }

    this.ws.next(json);
  }

  login() {
    let json = {
      function: 'login',
      data: {
        username: this.username
      }
    }

    this.ws.next(json);
  }

  addTute(user: Number) {
    let json = {
      function: 'add',
      data: {
        user: user
      }
    }
    
    this.ws.next(json);
  }
}
