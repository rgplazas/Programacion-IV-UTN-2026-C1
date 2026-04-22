import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { UserList } from './components/user-list/user-list';

@Component({
  selector: 'app-root',
  imports: [Header, UserList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('userhub');
}
