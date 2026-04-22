import { Injectable, signal, computed } from '@angular/core';
import { User, MOCK_USERS, UserFilter } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private users = signal<User[]>(MOCK_USERS);
  private filter = signal<UserFilter>('all');
   

  addUser(user: Omit<User, 'id' | 'createdAt'>): void{
      const newUser: User = {
          ...user,
          id:Date.now(),
          createdAt: new Date()
      };
  
      this.users.update(users => [...users, newUser]);
  
  }

  deleteUser(userId: number): void{
    this.users.update(users => users.filter(u => u.id !== userId ));
  }

  toggleUserStatus(userId:number): void{
    this.users.update(users => users.map(u => u.id === userId ? { ...u, isActive: !u.isActive} : u));
  }

  setFilter(newFilter: String):void{
    if(newFilter === "active" || newFilter === "inactive" || newFilter === "all"){
      this.filter.set(newFilter as UserFilter); 
    }
  }

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

  totalCount = computed(() => this.filterUsers().length);

}
