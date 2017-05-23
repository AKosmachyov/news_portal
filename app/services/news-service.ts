import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { News } from '../models/news';

@Injectable()
export class NewsService {
    private newsUrl = 'api/news';

    constructor( private http: Http ) { }

    getNewsRange(from: number, to: number): Promise<News[]> {
        return this.http.get(`api/news?from=${from}&to=${to}`)
            .toPromise()
            .then(response => response.json() as News[])
            .catch(this.handleError);
    }
    getNews(id: string): Promise<News> {
        return this.http.get(`api/news/${id}`)
            .toPromise()
            .then(response => response.json() as News)
            .catch(this.handleError);
    }
    addNews(news: News): Promise<string> {
        return this.http
            .post('api/news/insert', news)
            .toPromise()
            .then(res => {
                return res.text();
            })
            .catch(this.handleError);
    }
    update(news: News): Promise<News> {
        const url = `${this.newsUrl}/${news._id}`;
        return this.http
            .put(url, JSON.stringify(news))
            .toPromise()
            .then(() => news)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}