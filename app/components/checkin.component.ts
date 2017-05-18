import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { User } from '../models/user';

@Component({
    selector: 'checkin',
    template: `
       <div>
            <label for="login">Логин</label>
            <input name="login" [(ngModel)]="user.login"/>
            <label for="password">Пароль</label>
            <input name="password" type="password" [(ngModel)]="user.password"/>
            <label for="password-repeat">Повторите пароль</label>
            <input name="password-repeat" type="password" [(ngModel)]="user.passwordRepeat"/>
            <label for="name">Ваше имя</label>
            <input name="name" [(ngModel)]="user.name"/>
            
            <button class="btn btn-primary" (click)="sendData()">Войти</button>
       </div>
    `,
    styles: [``]
})
export class CheckinComponent {
    user: User = new User();
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    sendData(): void {
        this.authService.checkin(this.user).subscribe(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        });
    }
}