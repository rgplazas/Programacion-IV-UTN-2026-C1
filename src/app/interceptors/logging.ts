import { HttpInterceptorFn } from "@angular/common/http";
import { finalize } from "rxjs";

export const logging: HttpInterceptorFn = (req, next) => {

    const startTime = Date.now();
    console.log(`[HTTP] ${req.method} ${req.url}`);

    return next(req).pipe(
        finalize(()=>{
            const duracion = Date.now() - startTime;
            console.log(`[HTTP] ${req.method} ${req.url} - ${duracion}ms`);
        })
    );
}