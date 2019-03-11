import {Injectable} from '@angular/core';
import {SimpleCrypt} from "ngx-simple-crypt";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    //private static cryptr = Cryptr("anyslide");

    constructor() {
    }

    static setUser(user_id, username) {
        let simpleCrypt = new SimpleCrypt();
        localStorage.setItem('id', simpleCrypt.encode("anyslide", user_id));
        localStorage.setItem('username', username);
        //localStorage.setItem('picture', picture);
    }

    static getUserId() {
        let simpleCrypt = new SimpleCrypt();

        let id = localStorage.getItem('id');
        if(id != null) {
            id = simpleCrypt.decode("anyslide", id);
            return id;
        }
    }

    static getUserName() {
        const username = localStorage.getItem('username');
        return username;
    }

    static getUserPicture() {
        const userpic = localStorage.getItem('picture');
        return userpic;
    }

    static logout() {
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        window.location.reload();
    }

    static isAuthenticated() {
        if (this.getUserId()) {
            return true;
        } else {
            return false;
        }
    }

    static getIp() {
        if (localStorage.getItem('ip') === null) {
            return false;
        } else {
            return localStorage.getItem('ip');
        }
    }

    static getServerId() {
        if (localStorage.getItem('server_id') === null) {
            return false;
        } else {
            return localStorage.getItem('server_id');
        }
    }
}
