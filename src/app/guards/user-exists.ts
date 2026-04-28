import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../service/user";

export const userExists: CanActivateFn = (route, state) => {

    const userService = inject(UserService);
    const router = inject(Router);
    
    const id = Number(route.paramMap.get('id'));

    if(isNaN(id) || id <= 0){
        router.navigate(['/users']);
        return false;
    }

    const existe = userService.users().some(u => u.id === id);

    if(!existe){
        router.navigate(['/users']);
        return false;
    }

    return true;

}