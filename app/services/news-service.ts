import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { ArrNews } from '../models/news-arr';

@Injectable()
export class NewsService{
    getData(): News[] {
        return ArrNews;
    }
}