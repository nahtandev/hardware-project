// Dependencies
import  loadEffect  from "../views/basic_function.js";
import {
  checkUser
} from "../views/basic_function.js";
import {
  DashboardView
} from "../views/DashboardView.js";
import {
  AuthViews
} from "../views/AuthViews.js";
import {
  StartViews
} from "../views/StartViews.js"; 
import {
  AppViews
} from "../views/AppViews.js";

// Function which adds an entry to the browser session history stack
export const navigateTo = url => {
  history.pushState(null, null, url);
  loadEffect(()=>{
  router();
  }, 4000)
}
export const router = async () => {
  const routes = [/* List of front route valid in app */
    {
      path: '/app/dashboard',
      view: AppViews
    },
    {
      path: "/app",
      view: AppViews
    },
    {
      path: "/auth",
      view: AuthViews
    },
    {
      path: "/app/bug",
      view: AppViews
    },
    {
      path: "/app/equipment",
      view: AppViews
    },
    {
      path: "/app/service",
      view: AppViews
    },
    {
      path: "/app/users",
      view: AppViews
    },
    {
      path: "/",
      view: StartViews
    },
  ];
  const potentialMatches = routes.map(route => {

    /*The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. Here, it use */

    return {
      /* return  */
      route: route, /* a route */
      isMatch: location.pathname === route.path /* and boolean to check if it active. If route is active,
        True is return, */
    };
  });
  console.log(potentialMatches)
  /*The .find JS method returns the value of the first element in the provided array that satisfies the provided
    testing function. If no values satisfy the testing function, undefined is returned */
  // Here, we use method .find to return value of the active route. If route is active, it return true.

  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

  /* If we try to access a route which is not defined or which does not exit, we are redirect to the home page.*/
  // If match return undefined, so then it is that he has an attempt to access a route which does not exit.
  if (!match) {
    match = {
      //So, we are redirect to the home page with Dashboard route
      route: routes[7],
      isMatch: true
    };
  }

  //Check user before continue
  //checkUser();
  //If a active route is / => start screen
  const view = new match.route.view();
  view.getContentHTML().then((content)=> {
    document.querySelector(".body").innerHTML = content;
    view.execCode();
  })

};

/* The Popstate Event of the Window interface is fired when the active history entry changes while
the user navigates the session history. It changes the current history entry to that of the last page
the user visited. */
// We using Event Popstate to navigate on the session history.
window.addEventListener("popstate", (e)=> {
  router();
});


document.addEventListener("DOMContentLoaded", () => {
  /* After the initial HTML document hes been completly loaded and parsed, without waiting for stylesheets, images and subframes to finish loading. */

  //Start the router.
  router();
})