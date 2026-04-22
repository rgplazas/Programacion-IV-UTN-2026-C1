import { Component, inject } from '@angular/core';
import { UserCard } from '../user-card/user-card';
import { UserService } from '../../service/user';


@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})

export class UserList {
  private userService = inject(UserService);
  subtitle = 'Gestión de usuarios';
  filterUsers = this.userService.filterUsers;
  totalCount = this.userService.totalCount;

  addUser(nombre: string,  apellido: string,  email: string,  avatar: string, isActive: boolean): void{
        
    const newUser = {
          nombre:nombre,
          apellido:apellido,
          email:email,
          avatar:avatar,
          isActive:isActive
        };

        this.userService.addUser(newUser);
    
    }

  deleteUser(userId: number): void{
    this.userService.deleteUser(userId);
  }

  toggleUserStatus(userId:number): void{
    this.userService.toggleUserStatus(userId);
  }

  setFilter(newFilter: String):void{
      this.userService.setFilter(newFilter);
    }


}
