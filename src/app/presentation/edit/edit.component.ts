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
    collaborators: any[];
    editorInitialised;
    saving;
    presentation_created;
    error;
    slide_deleting;
    presentation_deleting;
    slide_creating;
    iscollaborator;

    getUsersOptions: any;
    selectedUser: any;
    temp_slide: any;
    temp_index: any;

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private socketService: SocketService, private toastr: ToastrService) {
        this.socket = this.socketService.getSocket();
    }

    ngOnInit() {
        this.current_slide = null;
        this.current_content = null;
        this.slide_deleting = false;
        this.presentation_deleting = false;
        this.slide_creating = false;
        this.loading = true;
        this.saving = false;
        this.presentation_created = false;
        this.editorInitialised = false;
        this.error = false;
        this.route.params.subscribe((params: ParamMap) => {
            this.edit_id = params['id'];
            //console.log(this.edit_id);
        });
        this.route.data
            .subscribe((data) => {
                //console.log(data);
                this.iscollaborator = data.collaborator;
            });
        this.getSlides();

        if (!this.iscollaborator) {
            this.initialiseSelect2();
            this.getCollaborators();
        }

        this.socket.emit("join_collaboration", this.edit_id, UserService.getUserId());
        this.sockets();


    }

    valueChange(event) {
        //console.log(event);
        this.selectedUser = event;
        //console.log(this.selectedUser);
    }

    removeLoader() {
        this.editorInitialised = true;
    }

    initialiseSelect2() {
        this.getUsersOptions = {
            multiple: false,
            minimumInputLength: 1,
            ajax: {
                url: environment.apiRoot + 'get_users.php',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        username: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;

                    return {
                        results: data.users,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
        };
    }

    getCollaborators() {
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
        };
        this.http.post(environment.apiRoot + 'get_collaborators.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.collaborators = response.collaborators;


                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
                        } else {
                            //console.log(response);
                            this.toastr.error("An Error Occurred While Loading Your Collaborators", "ERROR");
                        }
                    }
                },
                (error) => {
                    this.toastr.error("An Error Occurred While Loading Your Collaborators", "ERROR");
                    //console.error('Failed decline request ', error);
                },
            );
    }

    addCollaborator() {
        //console.log(this.selectedUser.text);
        //text: "zinger", id: "9

        if (this.selectedUser.id == UserService.getUserId()) {
            this.toastr.error("You are already a collaborator", "ERROR");
        } else {
            let data = {
                user_id: UserService.getUserId(),
                presentation_id: this.edit_id,
                collaborator_id: this.selectedUser.id,
            };
            this.http.post(environment.apiRoot + 'add_collaborator.php', data, {
                headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
            })
                .subscribe((response: any) => {
                        if (response.success) {
                            //console.log(response);
                            let collaborator = {
                                user_id: this.selectedUser.id,
                                username: this.selectedUser.text,
                            };
                            this.collaborators.push(collaborator);
                            this.toastr.success("Collaborator has been added", "SUCCESS");


                        } else {
                            if (response.code == 404) {
                                this.router.navigate(['/404']);
                            } else {
                                this.toastr.error(response.message, "ERROR");
                                //console.log(response);
                            }
                        }
                    },
                    (error) => {
                        //console.error('Failed decline request ', error);
                        this.toastr.error("An Error Occurred Please Try Again", "ERROR");
                    },
                );
        }
    }

    removeCollaborator(id, index) {
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
            collaborator_id: id,
        };
        this.http.post(environment.apiRoot + 'remove_collaborator.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.collaborators.splice(index, 1);
                        this.toastr.success("Collaborator has been removed", "SUCCESS");

                        this.socket.emit("leave_collaboration", this.edit_id, id);


                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
                        } else {
                            this.toastr.error(response.message, "ERROR");
                            //console.log(response);
                        }
                    }
                },
                (error) => {
                    //console.error('Failed decline request ', error);
                    this.toastr.error("An Error Occurred Please Try Again Later", "ERROR");
                },
            );
    }

    getSlides() {
        let type = '';
        if (this.iscollaborator) {
            type = 'colab';
        } else {
            type = 'edit';
        }
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
            type: type,
        };
        this.http.post(environment.apiRoot + 'get_slides.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.slides = response.slides;
                        //this.current_content = this.slides[0].content;
                        //this.current_index = 0;
                        //this.current_slide = this.slides[0];
                        let initial_slide = {
                            id: this.slides[0].id,
                            content: this.slides[0].content,
                        };
                        this.isSlideFree(initial_slide, 0);
                        //console.log(this.slides);
                        this.loading = false;

                    } else {
                        if (response.code == 404) {
                            this.router.navigate(['/404']);
                        } else {
                            this.error = true;
                            //console.log(response);
                        }
                    }
                },
                (error) => {
                    //console.error('Failed decline request ', error);
                    this.error = true;
                },
            );
    }

    newSlide() {
        this.slide_creating = true;
        let data = {
            user_id: UserService.getUserId(),
            presentation_id: this.edit_id,
        };

        this.http.post(environment.apiRoot + 'create_slide.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    this.slide_creating = false;
                    if (response.success) {
                        this.slides.push({id: response.id, content: ""});
                        this.toastr.success("Slide Has Been Created", "SUCCESS");
                        this.socket.emit("create_slide", this.edit_id, response.id, UserService.getUserId());
                    } else {
                        this.toastr.error("An Error Occurred Please Try Again", "ERROR");
                        //console.log(response);
                    }
                },
                (error) => {
                    this.slide_creating = false;
                    this.toastr.error("An Error Occurred Please Try Again", "ERROR");
                    //console.error('Failed decline request ', error);
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
                            this.socket.emit("delete_slide", this.edit_id, this.current_slide.id);
                            this.current_content = '';
                            this.current_index = null;
                            this.current_slide = null;
                            this.toastr.success("Slide Has Been Deleted", "SUCCESS");

                            let initial_slide = {
                                id: this.slides[0].id,
                                content: this.slides[0].content,
                            };
                            this.isSlideFree(initial_slide, 0);

                        } else {
                            this.toastr.error(response.message, "ERROR");
                            //console.log(response);
                        }

                    },
                    (error) => {
                        this.slide_deleting = false;
                        this.toastr.error("An Error Occured. Please Try Again", "ERROR");
                        //console.error('Failed decline request ', error);
                    },
                );
        }

    }

    deletePresentation() {
        this.presentation_deleting = true;
        let data = {
            presentation_id: this.edit_id,
            user_id: UserService.getUserId(),
        };

        this.http.post(environment.apiRoot + 'delete_presentation.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    this.presentation_deleting = false;
                    if (response.success) {
                        this.socket.emit("leave_collaboration", this.edit_id, 0);
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.toastr.error(response.message, "ERROR");
                        //console.log(response);
                    }

                },
                (error) => {
                    this.presentation_deleting = false;
                    this.toastr.error("An Error Occured. Please Try Again", "ERROR");
                    //console.error('Failed decline request ', error);
                },
            );

    }

    isSlideFree(slide: any, index: any) {
        if (index != this.current_index) {
            this.temp_slide = slide;
            this.temp_index = index;

            this.socket.emit('is_slide_free', this.edit_id, UserService.getUserId(), slide.id);
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
                        this.socket.emit('update_slide_content', this.edit_id, this.slides[this.current_index].id, this.slides[this.current_index].content);

                        //console.log(response);

                    } else {
                        this.toastr.error("An error occurred. Please try agian", "ERROR");
                        //console.log(response);
                    }

                },
                (error) => {
                    this.toastr.error("An error occurred. Please try agian", "ERROR");
                    //console.error('Failed decline request ', error);
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
        if (!this.iscollaborator) {
            this.socket.on("joinPresentation", (response) => {
                //console.log(response);
                if (response.status) {
                    self.message = response.id;
                    this.presentation_created = true;
                    //this.router.navigate(['/presentation/' + response.id]);
                } else {
                    self.message = "not created";
                    this.toastr.error("Presentation could not be created. Please try again", "ERROR");
                }
            });
        }

        this.socket.on("isSlideFree", (response) => {
            //console.log(response);
            if (response.collaboration_id == this.edit_id) {
                if (response.status || response.user_id == UserService.getUserId()) {
                    if (this.current_slide != null) {
                        if (this.current_content != this.slides[this.current_index].content) {
                            this.socket.emit('update_slide_content', this.edit_id, this.slides[this.current_index].id, this.current_content);
                        }
                    }
                    this.setContent(this.temp_slide, this.temp_index);
                } else {
                    this.toastr.info(response.username + " is editing this slide", "INFO");
                }
            }
        });

        this.socket.on("updateSlideContent", (response) => {
            //console.log(response);ppp
            let slide_id = response.id;
            let content = response.content;

            for (let i = 0; i < this.slides.length; i++) {
                if (this.slides[i].id == slide_id) {
                    this.slides[i].content = content;
                    break;
                }
            }
        });

        this.socket.on("deleteSlide", (response) => {
            for (let i = 0; i < this.slides.length; i++) {
                if (this.slides[i].id == response) {
                    this.slides.splice(i, 1);
                    //this.current_index = null;
                    //this.current_slide = null;
                    //this.toastr.success("Slide Has Been Deleted", "SUCCESS");

                    let initial_slide = {
                        id: this.slides[0].id,
                        content: this.slides[0].content,
                    };
                    break;
                }
            }
        });

        this.socket.on("createSlide", (response) => {
            if (response.creator_id != UserService.getUserId()) {
                let slide = {
                    id: response.slide_id,
                    content: '',
                };
                this.slides.push(slide);
            }
        });

        this.socket.on("leaveCollaboration", (response) => {
            if (response == UserService.getUserId() || response == 0) {
                if (this.iscollaborator) {
                    this.router.navigate(['/404']);
                }
            }
        });
    }

}
