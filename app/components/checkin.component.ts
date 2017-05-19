import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { User } from '../models/user';

@Component({
    selector: 'checkin',
    template: `

        <div class="col-md-6 col-md-offset-3 container-login">
            <div class="panel panel-login">
                <h2>Регистрация</h2>
                <hr/>
                <div class="form-horizontal panel-body">
                    <div *ngIf="isError" class="alert alert-danger" role="alert">
                        <button type="button" class="close" aria-label="Close" (click)="isError = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        Ошибка регистрации
                    </div>
                    <input class="form-control" placeholder="Логин" [(ngModel)]="user.login"/>                    
                    <input type="password" class="form-control" placeholder="Пароль" [(ngModel)]="user.password"/>
                    <input type="password" class="form-control" placeholder="Повторите пароль" [(ngModel)]="passwordRepeat"/>
                    <input class="form-control" placeholder="Ваше имя" [(ngModel)]="user.name"/>
                    <button class="btn btn-info col-xs-6 col-xs-offset-3" (click)="sendData()">Продолжить</button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./app/components/authorization.component.css']
})
export class CheckinComponent {
    user: User = new User();
    passwordRepeat: string;
    isError: boolean;
    constructor(
        private authService: AuthService,
        private router: Router
    ) {};
    checkDate(): boolean {
        if(this.user.login && this.user.name && this.user.password) {
            this.user.login = this.user.login.trim();
            this.user.name = this.user.name.trim();
            if (this.user.login && this.user.password == this.passwordRepeat)
                return true;
        }
        return false;
    }
    sendData(): void {
        if(!this.checkDate()) {
            this.isError = true;
            return;
        }
        this.authService.checkin(this.user).then(() => {
            if (this.authService.currentUser) {
                let redirect = this.authService.redirectUrl;
                this.router.navigate([redirect]);
            }
        }).catch(()=> {
            this.isError = true;
        });
    }
}