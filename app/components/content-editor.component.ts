import { Component, AfterViewInit } from '@angular/core';

declare var tinymce: any;

@Component({
    selector: 'content-editor',
    template: `<textarea id="editor"></textarea>`
})
export class ContentEditorComponent implements AfterViewInit {

    ngAfterViewInit() {
        tinymce.init({
            selector: '#editor',
            height: 300,
            menubar: false,
            plugins: [
                'advlist autolink lists link image preview',
                'searchreplace visualblocks code fullscreen',
                'media table contextmenu paste code'
            ],
            toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css']
        });
    }
}