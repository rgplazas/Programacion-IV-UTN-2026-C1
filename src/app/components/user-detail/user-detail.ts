import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId = signal<number>(0);

  user = computed(() => {
    const id = this.userId();
    return this.userService.users().find(u => u.id === id) ?? null;
  });

  constructor(){
    this.route.params.subscribe(params => {
      this.userId.set(Number(params['id']))
    })
  }

}
