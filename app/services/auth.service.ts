import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class AuthService {
    currentUser: User;
    redirectUrl: string = '/dashboard';
    constructor ( private http: Http ) {}

    login (login: string, password: string): Promise<User> {
        let user = {
            login: login,
            password: password
        };
        return this.http.post('api/profile/login', user)
            .toPromise()
            .then(response => {
                //TODO login
                let body = response.json();
                let newUser = new User();
                newUser.name = body.name;
                newUser._id = body._id;
                return this.currentUser = newUser;
            });
    }
    checkin (user: User): Promise<User> {
        return this.http.post('api/profile/checkin', user)
            .toPromise()
            .then(response => {
                user.password = null;
                user.login = null;
                user._id = response.json()._id;
                return this.currentUser = user;
            });
    }
    logout (): void {
        this.currentUser = undefined;
    }
}