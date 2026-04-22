import { Component, signal, computed, inject } from '@angular/core';
import { UserCard } from '../user-card/user-card';
import { User, MOCK_USERS, UserFilter } from '../../models/user.model';
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
  users = this.userService.allUsers;
  filter = signal<UserFilter>('all');

  filterUsers = computed (() => {
    const currentFilter = this.filter();
    const allUsers = this.users();

    if (currentFilter === 'active'){
      return allUsers.filter(u => u.isActive);
    }

    if (currentFilter === 'inactive'){
      return allUsers.filter(u => !u.isActive);
    }

    return allUsers;

  });

  totalCount = computed(()=> this.users().length);
  activeCount = computed(()=> this.users().filter(u=>u.isActive).length);

  refreshCount(): void {
    this.totalCount = this.totalCount;
  }
setFilter(newFilter: UserFilter):void{
    this.filter.set(newFilter);
  }

}
