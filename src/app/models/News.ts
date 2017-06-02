import { User } from './user';

export class News {
    title: string;
    titleContent: string;
    content: string;
    tag: string;
    author: User;
    publicationDate: Date;
    modifiedDate: Date;
    _id: string;
    archived: boolean;
    titleImg: string;
}
