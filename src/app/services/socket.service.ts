import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io(environment.serverUrl);
    // this.socket = io.connect();
  }
  getSocket() {
    return this.socket;
  }
}
