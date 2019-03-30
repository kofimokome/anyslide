import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {SocketService} from "../../services/socket.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    public loading;
    private socket;
    private presentations: any[];
    public name: string;
    private error;
    private message;
    finding_user;
    collaborations: any[];

    constructor(private router: Router, private socketService: SocketService, private http: HttpClient, private toastr: ToastrService) {
        this.socket = this.socketService.getSocket();
    }

    ngOnInit() {
        this.collaborations = [];
        this.loading = true;
        this.error = false;
        this.name = '';
        this.finding_user = true;
        if (!UserService.isAuthenticated()) {
            this.router.navigate(['/']);
        } else {
            this.getPresentations();
            this.getCollaborations();
        }
    }

    getPresentations() {
        let data = {
            user_id: UserService.getUserId(),
        };
        this.http.post(environment.apiRoot + 'get_presentations.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.presentations = response.presentations;
                        this.loading = false;

                    } else {
                        this.finding_user = false;
                        console.log(response);
                    }
                },
                (error) => {
                    this.finding_user = false;
                    console.error('Failed decline request ', error);
                },
            );
    }

    getCollaborations() {
        let data = {
            user_id: UserService.getUserId(),
        };
        this.http.post(environment.apiRoot + 'get_collaborations.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    if (response.success) {
                        //console.log(response);
                        this.collaborations = response.presentations;

                    } else {
                        console.log(response);
                        this.toastr.error(response.message, "ERROR");

                    }
                },
                (error) => {
                    //console.error('Failed decline request ', error);
                    this.toastr.error("An Error Occurred While Looking For Your Collaborations", "ERROR");

                },
            );
    }

    newPresentation() {
        if (this.name == '') {
            this.toastr.error("Please enter a valid presentation name", "ERROR");
        } else {
            let data = {
                name: this.name,
                user_id: UserService.getUserId(),
            };
            this.http.post(environment.apiRoot + 'create_presentation.php', data, {
                headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
            })
                .subscribe((response: any) => {
                        if (response.success) {
                            this.router.navigate(['/presentation/edit/' + response.id]);
                        } else {
                            this.toastr.error(response.message, "ERROR");

                        }
                    },
                    (error) => {
                        //console.error('Failed decline request ', error);
                        this.toastr.error("An Error Occurred Please Try Again Later", "ERROR");

                    },
                );
        }
    }

}
