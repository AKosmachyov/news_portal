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
                        logo
                    </div>
                    <div class="col-md-4  col-md-offset-4 col-xs-6 normalize-height">                    
                        <div *ngIf="!user; else userNavbar">
                             <button class="btn btn-primary" [routerLink]="['/login']">Вход</button>                
                             <button class="btn btn-primary" [routerLink]="['/checkin']">Регистрация</button>
                        </div>
                        <ng-template #userNavbar>
                            <div>
                                <button class="btn btn-primary" [routerLink]="['/editor']">Добавить</button>
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
        header {
            height: 68px;
            border-bottom: 1px solid #d5dddf;
            background: #fff;
        }
        .normalize-height {
            height: inherit;
        }
    `]
})

export class AppComponent implements DoCheck{
    user: User;
    constructor( private authService: AuthService) {
        this.user = this.authService.currentUser;
    };
    ngDoCheck(){
        this.user = this.authService.currentUser;
    }
}