import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    socket;

    constructor(private router: Router, private socketService: SocketService) {
        this.socket = socketService.getSocket();
        this.sockets();
    }

    ngOnInit() {
    }

    sockets() {
        this.socket.on('notification', (data) => {
            if (data != '') {

            }
        });
    }

}
