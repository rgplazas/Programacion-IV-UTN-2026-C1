import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { User, MOCK_USERS, UserFilter } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  
  //private users = signal<User[]>(MOCK_USERS);
  private filter = signal<UserFilter>('all');

  users   = signal<User[]>([]);
  loading = signal(false);
  error   = signal<string | null>(null);
 
  /*constructor(){
    effect(() => {
      this.loadUser();
    });
  }*/

  loadUser():void{
    this.loading.set(true);
    this.error.set(null);

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        const transformed = data.map(apiUser => ({
          id:apiUser.id,
          nombre:apiUser.username,
          apellido:apiUser.name,
          email:apiUser.email,
          avatar:'https://via.placeholder.com/150',
          isActive: true,
          createdAt: new Date()
        }));
        this.users.set(transformed);
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set("error al cargar usuario");
        this.loading.set(false);
      } 
    });
  }

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
