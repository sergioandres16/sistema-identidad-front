import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataString = localStorage.getItem('userData');

  if (!userDataString) {
    return next(req);
  }

  try {
    const userData = JSON.parse(userDataString);
    const token = userData.token;

    if (token) {
      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(modifiedReq);
    }
  } catch (e) {
    console.error('Error parsing user data', e);
  }

  return next(req);
};
