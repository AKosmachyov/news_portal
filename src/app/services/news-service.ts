import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { News } from '../models/news';

import { AuthService } from './auth.service';

@Injectable()
export class NewsService {
    constructor(
        private http: Http,
        private authService: AuthService
    ) { }

    getNewsRange(obj): Promise<News[]> {
        let url = 'api/news?count=' + obj.count;
        if(obj.id)
            url += "&id=" + obj.id;
        return this.http.get(url, {headers: this.authService.getAuthorizationHeader()})
            .toPromise()
            .then(response => response.json() as News[])
            .catch(this.handleError);
    }
    getNews(id: string): Promise<News> {
        return this.http.get(`api/news/${id}`, {headers: this.authService.getAuthorizationHeader()})
            .toPromise()
            .then(response => response.json() as News)
            .catch(this.handleError);
    }
    addNews(news: News): Promise<string> {
        return this.http
            .post('api/news/insert', news, {headers: this.authService.getAuthorizationHeader()})
            .toPromise()
            .then(res => {
                return res.text();
            })
            .catch(this.handleError);
    }
    update(news: News): Promise<string> {
        return this.http.post(`api/news/${news._id}/modify`, news, {headers: this.authService.getAuthorizationHeader()})
            .toPromise()
            .then((val) => val.text())
            .catch(this.handleError)
    }
    archiveNews(id: string): Promise<string> {
        return this.http.get(`api/news/${id}/archive`, {headers: this.authService.getAuthorizationHeader()})
            .toPromise()
            .then((val) => val.text())
            .catch(this.handleError)
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}