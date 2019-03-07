import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
  }

 static setUser(user_id, username) {
    localStorage.setItem('id', user_id);
    localStorage.setItem('username', username);
    //localStorage.setItem('picture', picture);
  }

 static getUserId() {
    const id = localStorage.getItem('id');
    return id;
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
