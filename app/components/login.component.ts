import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'login',
    template: `
        <div class="col-md-6 col-md-offset-3 container-login">
            <div class="panel panel-login">
                <h2>Авторизация</h2>
                <hr/>
                <form class="form-horizontal panel-body" #userForm="ngForm" (ngSubmit)="onSubmit()">
                    <div *ngIf="isError" class="alert alert-danger" role="alert">
                        <button type="button" class="close" aria-label="Close" (click)="isError = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {{errorStr}}
                    </div>
                    <input class="form-control" placeholder="Логин"
                           type="email" required email name="login"
                           [(ngModel)]="user.login" autocomplete="off">
                                          
                    <input type="password" class="form-control"
                           placeholder="Пароль" required minlength="8" #password="ngModel"
                           maxlength="24" name="password" [(ngModel)]="user.password">
                    <div *ngIf="password.errors && (password.dirty || password.touched)" class="alert alert-danger">
                        <div [hidden]="!(password.errors.minlength || password.errors.required)">
                            Пароль должен состоят минимум из 8 символов
                        </div>
                        <div [hidden]="!password.errors.maxlength">
                            Пароль должен быть меньше 24 символов
                        </div>
                    </div>      
                    <button type="submit" [disabled]="!userForm.valid" class="btn btn-info col-xs-6 col-xs-offset-3">Войти</button>
                </form>
            </div>
        </div>
    `,
    styleUrls: ['./app/components/authorization.component.css']
})
export class LoginComponent {
    user:User = new User();
    isError: boolean;
    errorStr: string;
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    onSubmit(): void {
        this.authService.login(this.user.login, this.user.password).then(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        }).catch((err)=> {
            if(!err.status) {
                this.errorStr = 'Отсутствует подключение к сети Интернет';
            } else {
                this.errorStr = 'Неверный логин или пароль';
            }
            this.isError = true;
        })
    }
}