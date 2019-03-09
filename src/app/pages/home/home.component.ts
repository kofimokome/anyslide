import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    private socket;
    private firstname: string;
    private lastname: string;
    private password: string;
    private cpassword: string;
    private username: string;
    private email: string;
    private error;
    private success;
    private message: string;
    public isregister;
    public loading;

    constructor(private router: Router, private socketService: SocketService, private http: HttpClient) {
        this.socket = socketService.getSocket();
        this.sockets();
    }

    ngOnInit() {
        this.error = false;
        this.success = false;
        this.isregister = true;
        this.loading = false;

        if (UserService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    switch_view() {
        this.error = false;
        this.success = false;
        this.isregister = !this.isregister;
    }

    login() {
        this.error = false;
        this.success = false;
        this.loading = true;
        const data = {
            username: this.username,
            password: this.password,
        };
        this.http.post(environment.apiRoot + 'login.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    this.loading = false;
                    if (response.success) {
                        this.success = true;
                        this.message = response.message;

                        // some clean up
                        this.username = '';
                        this.password = '';
                        UserService.setUser(response.id, response.username);
                        this.socket.emit('register_user', response.id, response.username);
                        this.router.navigate(['/dashboard']);


                    } else {
                        this.error = true;
                        this.message = response.message;
                    }
                },
                (error) => {
                    this.error = true;
                    this.message = "A server error occurred. Please try again later";
                    console.error('Failed decline request ', error);
                },
            );
    }

    receiveMessage($event) {
        this.switch_view();
    }

    register() {
        this.error = false;
        this.success = false;
        this.loading = true;
        const data = {
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            password: this.password,
            cpassword: this.cpassword,
            email: this.email
        };
        this.http.post(environment.apiRoot + 'register.php', data, {
            headers: new HttpHeaders().set('Access-Control-Allow-Headers', '*')
        })
            .subscribe((response: any) => {
                    this.loading = false;
                    if (response.success) {
                        this.success = true;
                        this.message = response.message;

                        // some clean up
                        this.firstname = '';
                        this.lastname = '';
                        this.username = '';
                        this.password = '';
                        this.cpassword = '';
                        this.email = '';
                    } else {
                        this.error = true;
                        this.message = response.message;
                    }
                },
                (error) => {
                    this.error = true;
                    this.message = "A server error occurred. Please try again later";
                    console.error('Failed decline request ', error);
                },
            );
    }

    sockets() {
        this.socket.on('notification', (data) => {
            if (data != '') {

            }
        });
    }

}
