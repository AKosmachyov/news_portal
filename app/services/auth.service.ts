import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class AuthService {
    currentUser: User;
    redirectUrl: string = '/dashboard';
    constructor ( private http: Http ) {
        this.currentUser = this.restoreCredentialFromLS();
    }

    login (login: string, password: string): Promise<User> {
        let user = {
            login: login,
            password: password
        };
        return this.http.post('api/profile/login', user)
            .toPromise()
            .then(response => {
                let body = response.json();
                this.setCredentialForLS(body);
                return this.currentUser = body as User;
            });
    }
    checkin (user: User): Promise<User> {
        return this.http.post('api/profile/checkin', user)
            .toPromise()
            .then(response => {
                user.password = null;
                user.login = null;
                user._id = response.json()._id;
                user.token = response.json().token;
                this.setCredentialForLS(user);
                return this.currentUser = user;
            });
    }
    logout (): void {
        this.currentUser = undefined;
        window.localStorage.clear();
    }
    getAuthorizationHeader () {
        if (this.currentUser && this.currentUser.token)
            return new Headers({ 'Authorization': `Basic ${this.currentUser.token}`});
        return null;
    }
    setCredentialForLS(user: User) {
        let ls = window.localStorage;
        ls.setItem("token", user.token);
        ls.setItem("name", user.name);
        ls.setItem("_id", user._id);
    }
    restoreCredentialFromLS(): User {
        let user: User = new User();
        let ls = window.localStorage;

        user.token = ls.getItem("token");
        user._id = ls.getItem("_id");
        user.name = ls.getItem("name");

        if(!user.token || !user._id || !user.name)
            return null;
        return user;
    }
}