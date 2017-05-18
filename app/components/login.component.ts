import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'login',
    template: `
        <div class="col-md-6 col-md-offset-3 container-login">
            <div class="panel panel-login">
                <h2>
                Авторизация
                </h2>
                <hr/>
                <div class="form-horizontal panel-body">
                    <div *ngIf="isError" class="alert alert-danger" role="alert">
                        <button type="button" class="close" aria-label="Close" (click)="isError = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        Неверный логин или пароль
                    </div>
                    <input class="form-control" placeholder="Логин" [(ngModel)]="login"/>                    
                    <input class="form-control" placeholder="Пароль" [(ngModel)]="password"/>
                    <button class="btn btn-info col-xs-6 col-xs-offset-3" (click)="sendData()">Войти</button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./app/components/authorization.component.css']
})
export class LoginComponent {
    login: string;
    password: string;
    isError: boolean;
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    sendData(): void {
        this.authService.login(this.login, this.password).then(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        }).catch(()=> {
            this.isError = true;
        })
    }
}