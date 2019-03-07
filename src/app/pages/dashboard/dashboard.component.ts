import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {SocketService} from "../../services/socket.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private loading;
    private socket;
    private presentations: string[];
    private name: string;
    private error;
    private message;

    constructor(private router: Router, private socketService: SocketService, private http: HttpClient) {
        this.socket = this.socketService.getSocket();
    }

    ngOnInit() {
        this.loading = true;
        this.error = false;
        this.name = '';
        if (!UserService.isAuthenticated()) {
            this.router.navigate(['/']);
        } else {
            this.socket.emit('register_user', UserService.getUserId(), UserService.getUserName());
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
                            console.log(response);
                        }
                    },
                    (error) => {
                        console.error('Failed decline request ', error);
                    },
                );
        }
    }

    newPresentation() {
        if (this.name == '') {
            this.error = true;
            this.message = "please enter a valid presentation name";
        } else {
            this.error = false;
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
                            this.error = true;
                            this.message = response.message;
                        }
                    },
                    (error) => {
                        console.error('Failed decline request ', error);
                    },
                );
        }
    }

}
