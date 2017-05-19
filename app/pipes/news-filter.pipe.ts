import { Pipe, PipeTransform } from '@angular/core';

import { News } from '../models/News';

@Pipe({
    name: 'newsFilter',
    pure: false
})
export class NewsFilterPipe implements PipeTransform {
    transform(news: News[], author?: string, date?: Date) {
        return news.filter(news => {
            let isDateFiltered: boolean = true;
            let isAuthorFiltered: boolean = true;
            if(date){
                if (news.modifiedDate) {
                    isDateFiltered = news.modifiedDate == date;
                }
            }
            if (author) {
                author = author.trim();
                isAuthorFiltered = news.author.indexOf(author) > -1 ? true: false;
            }
            return isDateFiltered && isAuthorFiltered;
        });
    }
}