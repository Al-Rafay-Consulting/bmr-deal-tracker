import { Router } from '@angular/router';
export class ParentBase {
  constructor(public router ? : Router) {
    // console.log(this.router.url);
    window.onpopstate = function (event) {
      // console.log("Forward/Back is button pressed. That's why reloading the page.");
      window.location.reload();
    }
    if (router.navigated) {
      if (this.router.getCurrentNavigation() == null)
        return;
      const navigationURL = {
        route: this.router.url.split('?')[0],
        queryParams: this.router.getCurrentNavigation().extractedUrl.queryParams
      };
      sessionStorage.setItem('navigationURL', JSON.stringify(navigationURL));
    } else {
      //To maintain routing after page refresh
      const savedNavigationURL = sessionStorage.getItem('navigationURL');
      if (savedNavigationURL) {
        const navigationURL = JSON.parse(savedNavigationURL);
        // console.log('navigationURL after page reload:', navigationURL);
        this.router.navigate([navigationURL.route], {
          queryParams: navigationURL.queryParams
        });
        sessionStorage.removeItem('navigationURL');
      }
    }
    /*
    if (router) {
        console.log('window.history.length: ', window.history.length);
        if (window.history.state.navigationId > 1) {
            console.log(this.router.url);
            if (this.router.getCurrentNavigation()) {
                const navigationURL = {
                    route: this.router.url.split('?')[0],
                    queryParams: this.router.getCurrentNavigation().extractedUrl.queryParams,
                    historyLength: window.history.length
                };

                //Redirect on Back and Forward Browser buttons
                const savedNavigationURL = sessionStorage.getItem('navigationURL');
                if (savedNavigationURL) {
                    const savedRoute = JSON.parse(savedNavigationURL);
                    console.log('savedRoute.historyLength: ', savedRoute.historyLength);

                    if (window.history.length == savedRoute.historyLength && savedRoute.route != navigationURL.route) {
                        navigationURL.historyLength = 0;
                        sessionStorage.setItem('navigationURL', JSON.stringify(navigationURL));
                        this.router.navigate([navigationURL.route], { queryParams: navigationURL.queryParams });
                        window.location.reload();
                    }
                    else {
                        sessionStorage.setItem('navigationURL', JSON.stringify(navigationURL));
                    }
                }
                if (savedNavigationURL == null) {
                    sessionStorage.setItem('navigationURL', JSON.stringify(navigationURL));
                }
            }
        }
        else {
            //To maintain routing after page refresh
            const savedNavigationURL = sessionStorage.getItem('navigationURL');
            if (savedNavigationURL) {
                const navigationURL = JSON.parse(savedNavigationURL);
                this.router.navigate([navigationURL.route], { queryParams: navigationURL.queryParams });
            }
        }
    }
    */
  }
}
