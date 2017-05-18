import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'login',
    template: `
        <div class="form-horizontal">
            <label for="login">Логин</label>
            <input name="login" class="form-control" [(ngModel)]="login"/>
            <label for="password">Пароль</label>
            <input name="password" type="password" class="form-control" [(ngModel)]="password"/>
            <button class="btn btn-primary" (click)="sendData()">Войти</button>
        </div>
    `,
    styles: [``]
})
export class LoginComponent {
    login: string;
    password: string;
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    sendData(): void {
        this.authService.login(this.login, this.password).subscribe(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        })
    }
}