import { Component, DoCheck } from '@angular/core';

import { AuthService } from '../services/auth.service';

import { User } from '../models/user';

@Component({
    selector: 'app',
    template: `
        <header>
            <div class="container normalize-height">
                <div class="row normalize-height">
                    <div class="col-md-4 col-xs-4">
                        <h2>
                            <a [routerLink]="['/dashboard']">News portal</a>
                        </h2>
                    </div>
                    <div class="col-md-4 col-md-offset-4 col-xs-6 normalize-height">
                        <div *ngIf="!user; else userNavbar" class="user-navbar">
                             <button class="btn btn-info" [routerLink]="['/login']">Вход</button>                
                             <button class="btn btn-info" [routerLink]="['/checkin']">Регистрация</button>
                        </div>
                        <ng-template #userNavbar>
                            <div class="user-navbar">
                                <button class="btn btn-info" [routerLink]="['/editor']">Добавить</button>
                                <button class="btn btn-info" (click)="logout()">выйти</button>
                                <span>{{user.name}}</span>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </header>
        <div class="container">
            <router-outlet></router-outlet>
        </div>                
    `,
    styles: [`
        a {
            font-size: 30px;
            color: #5bc0de;
            cursor: pointer;
            -webkit-user-select: none;
            text-decoration: none;
        }
        header {
            height: 68px;
            border-bottom: 1px solid #d5dddf;
            background: #fff;
        }
        .normalize-height {
            height: inherit;
        }
        .user-navbar {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        .user-navbar > button {
            margin-left: 7px;
        }
        button + span {
            font-size: 20px;
            padding-left: 9px;
        }
    `]
})

export class AppComponent implements DoCheck{
    user: User;
    constructor( private authService: AuthService) {
        this.user = this.authService.currentUser;
    };
    ngDoCheck() {
        this.user = this.authService.currentUser;
    }
    logout() {
        this.authService.logout();
    }
}