import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'checkin',
    template: `
        <div class="col-md-6 col-md-offset-3 container-login">
            <div class="panel panel-login">
                <h2>Регистрация</h2>
                <hr/>
                <form class="form-horizontal panel-body" #userForm="ngForm" (ngSubmit)="onSubmit()">
                    <div *ngIf="dislpayError" class="alert alert-danger" role="alert">
                        <button type="button" class="close" aria-label="Close" (click)="dislpayError = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {{errorStr}}
                    </div>
                    <input type="email" class="form-control" placeholder="Логин" required
                           email name="login" [(ngModel)]="user.login" autocomplete="off">
                           
                    <div class="password-block">
                         <input class="form-control" placeholder="Пароль" required
                           name="password" minlength="8" maxlength="24" #password="ngModel"
                           [(ngModel)]="user.password" [(type)]="passwordInputType">
                        <i *ngIf="user.password" (mousedown)="showPassword(true)" (mouseup)="showPassword(false)"
                            class="glyphicon glyphicon-eye-open">
                        </i>
                    </div>
                    <div *ngIf="password.errors && (password.dirty || password.touched)" class="alert alert-danger">
                        <div [hidden]="!(password.errors.minlength || password.errors.required)">
                            Пароль должен состоят минимум из 8 символов
                        </div>
                        <div [hidden]="!password.errors.maxlength">
                            Пароль должен быть меньше 24 символов
                        </div>
                    </div>
                    
                    <input type="text" class="form-control" placeholder="Ваше имя" required
                           name="name" value minlength="2" maxlength="24" #name="ngModel"
                           [(ngModel)]="user.name">

                    <button type="submit" [disabled]="!userForm.valid" class="btn btn-info col-xs-6 col-xs-offset-3">
                        Продолжить
                    </button>
                </form>
            </div>
        </div>
    `,
    styleUrls: ['./app/components/authorization.component.css']
})
export class CheckinComponent {
    user: User = new User();
    dislpayError: boolean;
    errorStr: string;
    passwordInputType: string = 'password';
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    onSubmit(): void {
        this.authService.checkin(this.user).then(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        }).catch((err)=> {
            if(!err.status) {
                this.errorStr = 'Отсутствует подключение к сети Интернет';
            } else {
                this.errorStr = 'Данный логин уже зарегистрирован';
            }
            this.dislpayError = true;
        });
    }
    showPassword(flag: boolean){
        this.passwordInputType = flag ? "text" : "password";
    }
}