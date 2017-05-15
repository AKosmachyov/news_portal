import { Component } from '@angular/core';
import { News } from './models/news';

@Component({
    selector: 'app',
    template: `
        <header>header</header>
        <div class="container">
            <preview-news [news]="news"></preview-news>
            <preview-news [news]="news"></preview-news>
            <preview-news [news]="news"></preview-news>
        </div>                
    `,
    styles: [`
        header {
            height: 68px;
            border-bottom: 1px solid #d5dddf;
            background: #fff;
        }
    `]
})

export class AppComponent {
    news: News;
    constructor() {
        this.news = new News({
            tag: 'новинки',
            title: 'Сегодня на радио: хиты FM',
            author: 'редакция яндекс',
            publicationDate: new Date(),
            content: `Формa авторизации. (Вводить и проверять имя пользователя.)
            b. Лента новостей. (Должна содержащать заголовок новости, автора, дату и время публикации новости, краткое начало новости, кнопку/ссылку Подробнее. Предусмотреть вывод на экран фиксированного количества новостей плюс возможность выбора последующих страниц ленты новостей (или pagination или Infinite Scroll...))
        c. Создание новости`
        });
    }
}
