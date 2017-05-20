import { Pipe, PipeTransform } from '@angular/core';

import { News } from '../models/News';

@Pipe({
    name: 'newsFilter',
    pure: false
})
export class NewsFilterPipe implements PipeTransform {
    transform(news: News[], author?: string, date?: string) {
        if (date) {
            var startDateQuery = +new Date(date);
            var endDateQuery = startDateQuery + 86400000;
        }
        return news.filter(news => {
            let isDateFiltered: boolean = true;
            let isAuthorFiltered: boolean = true;
            if(date) {
                let checkDate = news.modifiedDate ? +new Date(news.modifiedDate): +new Date(news.publicationDate);
                isDateFiltered = checkDate >= startDateQuery && checkDate < endDateQuery;
            }
            if (author) {
                author = author.trim();
                isAuthorFiltered = news.author.indexOf(author) > -1;
            }
            return isDateFiltered && isAuthorFiltered;
        });
    }
}