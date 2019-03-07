import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";
import * as Quill from "../../../../node_modules/quill";
import * as Delta from "../../../../node_modules/quill-delta";

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    private edit_id;
    private loading;
    private slides: any[];
    private slide_content: string;
    private editor: any;
    private editor_initialised;
    private current_slide: any;
    private current_index;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
        this.current_slide = null;
        this.editor_initialised = false;
        this.loading = true;
        this.slide_content = '';
        this.route.params.subscribe((params: ParamMap) => {
            this.edit_id = params['id'];
            console.log(this.edit_id);
        });
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id
        };
        this.http.post(environment.apiRoot + 'get_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);
                        for (let i = 0; i < response.slides.length; i++) {
                            //response.slides[i].content = new Delta(JSON.parse(response.slides[i].content));
                        }
                        this.slides = response.slides;
                        //console.log(this.slides);
                        this.loading = false;

                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
                        } else {
                            console.log(response);
                        }
                    }
                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
    }

    newSlide() {
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
        };

        this.http.post(environment.apiRoot + 'create_slide.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);
                        this.slides.push({id: response.id, content: ""});

                    } else {
                        console.log(response);
                    }

                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
        this.slides.push(1);
    }

    setContent(slide: any, index: any) {
        if (this.current_slide == null) {
            this.current_slide = slide;
        } else {
            this.slides[this.current_index].content = this.editor.getContents();
        }
        if (!this.editor_initialised) {
            this.editor = new Quill('#editor', {
                theme: 'snow'
            });

            this.editor_initialised = true;
        }
        this.current_index = index;
        this.editor.setContents(slide.content);

    }

    saveSlides() {
        if (this.current_slide != null) {
            //this.slides[this.current_index].content = this.editor.getContents();
        }

        let temp_slides = JSON.parse(JSON.stringify(this.slides));
        for (let i = 0; i < temp_slides.length; i++) {
            temp_slides[i].content = JSON.stringify(temp_slides[i].content);
        }
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
            slides: temp_slides,
        };

        //console.log(data.slides);
        this.http.post(environment.apiRoot + 'save_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);

                    } else {
                        console.log(response);
                    }

                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
    }

    startPresentation() {

    }

}
