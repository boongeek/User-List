import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = new Array<User>();

  constructor() { }

  getAll() {
    return this.users;
  }

  get(id: number) {
    return this.users[id];
  }

  getId(user: User) {
    return this.users.indexOf(user);
  }

  add(user: User) {
    // add user to Users array & return id where id = the index in the array
    let newLength = this.users.push(user);
    let index = newLength - 1;
    return index;
  }

  update(id: number, firstname: string, lastname: string, email: string, role: string) {
    let user = this.users[id];
    user.firstname = firstname;
    user.lastname  = lastname;
    user.email  = email;
    user.role  = role;
  }

  delete(id: number) {
    this.users.splice(id, 1);
  }
}
