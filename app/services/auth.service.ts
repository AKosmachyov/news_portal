import { Injectable } from '@angular/core';

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
    login (login: string, password: string): Promise<User> {
        return this.findUser(login, password).then((user) => this.currentUser = user);
    }
    checkin (user: User): Promise<User> {
        this.users.push(user);
        this.currentUser = user;
        return Promise.resolve(user);
    }
    logout (): void {
        this.currentUser = undefined;
    }
    findUser(login, password):Promise<User> {
        return new Promise((resolve, reject) => {
            for(let i=0; i < this.users.length; i++) {
                if(this.users[i].login == login && this.users[i].password == password) {
                    resolve(this.users[i]);
                }
            }
            reject();
        })
    }
}