import { Routes } from '@angular/router';
import { UserList } from './components/user-list/user-list';
import { Login } from './components/login/login';
import { userExists } from './guards/user-exists';
import { userResolver } from './resolvers/user';
import { Component } from '@angular/core';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'users', component: UserList},
    { path: 'users/:id', loadComponent: () => import('./components/user-detail/user-detail').then(m => m.UserDetail),
        canActivate: [userExists],
        resolve: {user: userResolver}
     },
    { path: 'login', component: Login },
    { path: '**', redirectTo: 'login' }

];
