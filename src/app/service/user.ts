import { Injectable, signal, computed } from '@angular/core';
import { User, MOCK_USERS } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private users = signal<User[]>(MOCK_USERS);
  readonly allUsers = this.users.asReadonly();
  
  totalCount = computed(() => this.users().length);

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

}
