export class News {
    title: string;
    content: string;
    tag: string;
    author: string;
    publicationDate: Date;
    modifiedDate: Date;

    constructor(obj) {
        this.title = obj.title;
        this.content = obj.content;
        this.tag = obj.tag;
        this.author = obj.author;
        this.publicationDate = obj.publicationDate;
    }
}
