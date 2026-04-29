import { HttpInterceptorFn } from "@angular/common/http";
import { retry, delay} from "rxjs/operators";
import { of } from "rxjs";


export const retryInt:HttpInterceptorFn = (req, next) => { 

    return next(req).pipe(
        retry({
            count:3,
            delay:(retryCount) => of(retryCount).pipe(delay(1000 * retryCount))
        })
    );
};