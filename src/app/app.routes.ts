import { Routes } from '@angular/router';
import { UserList } from './components/user-list/user-list';
import { userExists } from './guards/user-exists';
import { userResolver } from './resolvers/user';

export const routes: Routes = [

    { path: '', redirectTo: 'users', pathMatch: 'full' },
    { path: 'users', component: UserList },
    { path: 'users/:id', loadComponent: () => import('./components/user-detail/user-detail').then(m => m.UserDetail),
        canActivate: [userExists],
        resolve: {user: userResolver}
     },
    { path: '**', redirectTo: 'users' }

];
