import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {UserService} from "./user.service";

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io(environment.serverUrl);
        // this.socket = io.connect();
        if (UserService.isAuthenticated()) {
            this.socket.emit('register_user', UserService.getUserId(), UserService.getUserName());
        }
    }

    getSocket() {
        return this.socket;
    }
}
