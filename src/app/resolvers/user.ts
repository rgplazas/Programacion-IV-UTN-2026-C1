import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { UserService } from "../service/user";
import { User } from "../models/user.model";

export const userResolver: ResolveFn<User | null> = (route) => {
    const userService = inject(UserService);

    const id = Number(route.paramMap.get('id'));

    if(isNaN(id)) return null;

    return userService.users().find(u => u.id === id) ?? null;

}