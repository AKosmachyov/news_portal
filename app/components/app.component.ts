import { Component } from '@angular/core';

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
                        <button class="btn btn-primary">Вход</button>                
                        <button class="btn btn-primary">Регистрация</button>
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

export class AppComponent { }