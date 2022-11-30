import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export class ErrorModule {
  constructor() {}

  public static handleError = (error: HttpErrorResponse) => {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // handle client-side error
      msg = `Error: ${error.error.message}`;
    } else {
      // handle server-side error
      msg = `Error ${error.status}:\n ${error.error["errors"].join("\n")}`;
    }
    console.log(error);
    console.log(msg);
    return throwError(() => new Error(msg));
  }
}
