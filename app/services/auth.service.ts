import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { User } from '../models/user';

@Injectable()
export class AuthService {
    currentUser: User;
    redirectUrl: string = '/dashboard';
    users: User[] = [{
        id:1,
        login: 'qwe@gmail.com',
        password: 'qwe',
        name: 'test'
    }];
    login(login: string, password: string): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => this.currentUser = this.users[0]);
    }
    checkin(user: User): Observable<boolean> {
        return Observable.of(true).delay(1000).do(val => this.currentUser = user);
    }
}