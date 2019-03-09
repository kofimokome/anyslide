import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";
import {SocketService} from "../../services/socket.service";
import {EditorComponent, EditorModule} from "@tinymce/tinymce-angular";


@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    private edit_id;
    public loading;
    private slides: any[];
    private editor: any;
    private editor_initialised;
    private current_slide: any;
    private current_content: string;
    private current_index;
    private socket;
    private message;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private socketService: SocketService) {
        this.socket = this.socketService.getSocket();
    }

    ngOnInit() {
        this.current_slide = null;
        this.editor_initialised = false;
        this.loading = true;
        this.route.params.subscribe((params: ParamMap) => {
            this.edit_id = params['id'];
            console.log(this.edit_id);
        });
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
            type: 'edit',
        };
        this.http.post(environment.apiRoot + 'get_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        console.log(response);
                        this.slides = response.slides;
                        this.current_content = this.slides[0].content;
                        this.current_index = 0;
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

        this.sockets();
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
            this.slides[this.current_index].content = this.current_content;
        }
        if (!this.editor_initialised) {
            /*this.editor = new Quill('#editor', {
                theme: 'snow'
            });*/

            this.editor_initialised = true;
        }
        this.current_index = index;
        this.current_content = this.slides[this.current_index].content;

        //this.editor.setContents(slide.content);

    }

    saveSlides() {
        if (this.current_slide != null) {
            this.slides[this.current_index].content = this.current_content;
        }

        //let temp_slides = JSON.parse(JSON.stringify(this.slides));

        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
            slides: this.slides,
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

    startPresentation(ispublic: boolean, password: string) {
        if (ispublic) {
            this.socket.emit("create_presentation", this.edit_id, false);
        } else {
        }
    }

    sockets() {
        let self = this;
        this.socket.on("joinPresentation", (response) => {
            console.log(response);
            if (response.status) {
                self.message =  response.id;
                //this.router.navigate(['/presentation/' + response.id]);
            } else {
                self.message = "not created";
            }
        })
    }

}
