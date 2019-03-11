import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";
import {SocketService} from "../../services/socket.service";
import {EditorComponent, EditorModule} from "@tinymce/tinymce-angular";
import {ToastrService} from 'ngx-toastr';


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
    private current_slide: any;
    private current_content: string;
    private current_index;
    private socket;
    private message;
    editorInitialised;
    saving;
    presentation_created;
    error;
    slide_deleting;
    presentation_deleting

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private socketService: SocketService, private toastr: ToastrService) {
        this.socket = this.socketService.getSocket();
    }

    ngOnInit() {
        this.current_slide = null;
        this.current_content = null;
        this.slide_deleting = false;
        this.presentation_deleting = false;
        this.loading = true;
        this.saving = false;
        this.presentation_created = false;
        this.editorInitialised = false;
        this.error = false;
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
                        this.current_slide = this.slides[0];
                        //console.log(this.slides);
                        this.loading = false;

                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
                        } else {
                            this.error = true;
                            console.log(response);
                        }
                    }
                },
                (error) => {
                    console.error('Failed decline request ', error);
                    this.error = true;
                },
            );

        this.sockets();
    }

    removeLoader() {
        this.editorInitialised = true;
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
                        this.slides.push({id: response.id, content: ""});
                    } else {
                        console.log(response);
                    }
                },
                (error) => {
                    console.error('Failed decline request ', error);
                },
            );
    }

    deleteSlide() {
        if (this.slides.length <= 1) {
            this.toastr.error("You Must Have At Least One Slide", "ERROR");
        } else {
            this.slide_deleting = true;
            let data = {
                slide_id: this.current_slide.id,
                presentation_id: this.edit_id
            };

            this.http.post(environment.apiRoot + 'delete_slide.php', data, {
                headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
            })
                .subscribe((response: any) => {
                        this.slide_deleting = false;
                        if (response.success) {
                            this.slides.splice(this.current_index, 1);
                            this.current_content = this.slides[0].content;
                            this.current_index = 0;
                            this.current_slide = this.slides[0];
                            this.toastr.success("Slide Has Been Deleted", "SUCCESS");

                        } else {
                            this.toastr.error(response.message, "ERROR");
                            console.log(response);
                        }

                    },
                    (error) => {
                        this.toastr.error("An Error Occured. Please Try Again", "ERROR");
                        console.error('Failed decline request ', error);
                    },
                );
        }

    }

    setContent(slide: any, index: any) {
        if (this.current_slide == null) {
            this.current_slide = slide;
        } else {
            this.slides[this.current_index].content = this.current_content;
        }
        this.current_index = index;
        this.current_content = this.slides[this.current_index].content;
        this.current_slide = slide;

        //this.editor.setContents(slide.content);

    }

    saveSlides() {
        this.saving = true;
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
                    this.saving = false;
                    if (response.success) {
                        this.toastr.success('Presentation slides have been saved', 'SUCCESS',);
                        console.log(response);

                    } else {
                        this.toastr.error("An error occurred. Please try agian", "ERROR");
                        console.log(response);
                    }

                },
                (error) => {
                    this.toastr.error("An error occurred. Please try agian", "ERROR");
                    console.error('Failed decline request ', error);
                    this.saving = false;
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
                self.message = response.id;
                this.presentation_created = true;
                //this.router.navigate(['/presentation/' + response.id]);
            } else {
                self.message = "not created";
                this.toastr.error("Presentation could not be created. Please try again", "ERROR");
            }
        })
    }

}
