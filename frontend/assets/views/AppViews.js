import {
  UserViews
} from "../views/UserViews.js";
import {
  BugViews
} from "../views/BugViews.js";
import {
  EquipmentsViews
} from "../views/EquipmentsView.js";
import {
  ServiceViews
} from "../views/ServiceViews.js";
import {
  DashboardView
} from "./DashboardView.js";
import loadEffect from "./basic_function.js";
import {
  checkUser
} from "./basic_function.js";
import {
  logout
} from "./basic_function.js";
export class AppViews {
  constructor(title, contentHTML) {
    this.title = "HardWare";
    this.contentHTML = '<!-- Main Bloc --><div class="main-bloc d-flex"><!-- Sidebar Bloc --><div class="sidebar-bloc d-flex flex-column align-items-center"><!-- Logo / Site title--><div class="logo d-flex"><span>hard</span><span>ware</span></div><!-- Nav Menu --><nav class="width-100p d-flex flex-column align-items-center"><ul class="d-flex flex-column align-items-center"><a class="width-100p d-flex" href="/app/dashboard" id="dashboard-link" data-link><span class="active-effect"></span><li class=""><svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><g id="meter" transform="translate(-2.25 -2.25)"><path id="Tracé_19" data-name="Tracé 19" d="M29.25,18a11.168,11.168,0,0,0-1.282-5.195l-1.682,1.683A8.942,8.942,0,0,1,27,18Z" fill="" /> <path id="Tracé_20" data-name="Tracé 20" d="M26.341,11.25,24.75,9.659l-5.3,5.3A3.337,3.337,0,0,0,18,14.625,3.375,3.375,0,1,0,21.375,18a3.337,3.337,0,0,0-.337-1.446ZM18,19.125A1.125,1.125,0,1,1,19.125,18,1.125,1.125,0,0,1,18,19.125Z" fill="" /> <path id="Tracé_21" data-name="Tracé 21" d="M18,9a8.946,8.946,0,0,1,3.512.714L23.2,8.031A11.234,11.234,0,0,0,6.75,18H9a9.011,9.011,0,0,1,9-9Z" fill="" /> <path id="Tracé_22" data-name="Tracé 22" d="M17.25,32.25a15,15,0,1,1,15-15A15,15,0,0,1,17.25,32.25Zm0-27.857A12.857,12.857,0,1,0,30.107,17.25,12.857,12.857,0,0,0,17.25,4.393Z" fill="" /></g></svg><span>Tableau de Bord</span></li>\
          </a>\
          <li class="width-100p d-flex">\
            <span class="active-effect"></span>\
            <a href="/app/equipment" id="equipment-link">\
              <svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="31.5"\
                viewBox="0 0 18 31.5">\
                <path id="plug"\
                  d="M24.75,9H23.625V2.25h-2.25V9h-6.75V2.25h-2.25V9H11.25A2.25,2.25,0,0,0,9,11.25V18a9.008,9.008,0,0,0,7.875,8.921V33.75h2.25V26.921A9.008,9.008,0,0,0,27,18V11.25A2.25,2.25,0,0,0,24.75,9Zm0,9a6.75,6.75,0,0,1-13.5,0V11.25h13.5Z"\
                  transform="translate(-9 -2.25)" fill="" />\
              </svg>\
              <span>Equipements</span>\
            </a>\
          </li>\
          <li class="width-100p d-flex">\
            <span class="active-effect"></span>\
            <a href="/app/users" id="users-link">\
              <svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" width="31.5" height="31.5"\
                viewBox="0 0 31.5 31.5" fill="">\
                <g id="user-multiple" transform="translate(-2.25 -2.25)">\
                  <path id="Tracé_14" data-name="Tracé 14"\
                    d="M33.75,33.75H31.5V28.125A5.632,5.632,0,0,0,25.875,22.5V20.25a7.884,7.884,0,0,1,7.875,7.875Z"\
                    fill="" />\
                  <path id="Tracé_15"\ data-name="Tracé 15"\
                    d="M24.75,33.75H22.5V28.125A5.632,5.632,0,0,0,16.875,22.5h-6.75A5.632,5.632,0,0,0,4.5,28.125V33.75H2.25V28.125a7.884,7.884,0,0,1,7.875-7.875h6.75a7.884,7.884,0,0,1,7.875,7.875Z"\
                    fill="" />\
                  <path id="Tracé_16"\ data-name="Tracé 16"\
                    d="M22.5,2.25V4.5a5.625,5.625,0,0,1,0,11.25V18a7.875,7.875,0,1,0,0-15.75Z"\
                    fill="" />\
                  <path id="Tracé_17" data-name="Tracé 17"\
                    d="M13.5,4.5a5.625,5.625,0,1,1-5.625,5.625A5.625,5.625,0,0,1,13.5,4.5m0-2.25a7.875,7.875,0,1,0,7.875,7.875A7.875,7.875,0,0,0,13.5,2.25Z"\
                    fill="" />\
                </g>\
              </svg>\
              <span>Utilisateurs</span>\
            </a>\
          </li>\
          <li class="width-100p d-flex">\
            <span class="active-effect"></span>\
            <a href="/app/service" id="service-link">\
              <svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" width="31.5" height="31.5"\
                viewBox="0 0 31.5 31.5">\
                <g id="grid" transform="translate(-2.25 -2.25)">\
                <path id="Tracé_11" data-name="Tracé 11"\
                    d="M2.25,5.625A3.375,3.375,0,0,1,5.625,2.25h6.75A3.375,3.375,0,0,1,15.75,5.625v6.75a3.375,3.375,0,0,1-3.375,3.375H5.625A3.375,3.375,0,0,1,2.25,12.375ZM5.625,4.5A1.125,1.125,0,0,0,4.5,5.625v6.75A1.125,1.125,0,0,0,5.625,13.5h6.75A1.125,1.125,0,0,0,13.5,12.375V5.625A1.125,1.125,0,0,0,12.375,4.5ZM20.25,5.625A3.375,3.375,0,0,1,23.625,2.25h6.75A3.375,3.375,0,0,1,33.75,5.625v6.75a3.375,3.375,0,0,1-3.375,3.375h-6.75a3.375,3.375,0,0,1-3.375-3.375ZM23.625,4.5A1.125,1.125,0,0,0,22.5,5.625v6.75A1.125,1.125,0,0,0,23.625,13.5h6.75A1.125,1.125,0,0,0,31.5,12.375V5.625A1.125,1.125,0,0,0,30.375,4.5ZM2.25,23.625A3.375,3.375,0,0,1,5.625,20.25h6.75a3.375,3.375,0,0,1,3.375,3.375v6.75a3.375,3.375,0,0,1-3.375,3.375H5.625A3.375,3.375,0,0,1,2.25,30.375ZM5.625,22.5A1.125,1.125,0,0,0,4.5,23.625v6.75A1.125,1.125,0,0,0,5.625,31.5h6.75A1.125,1.125,0,0,0,13.5,30.375v-6.75A1.125,1.125,0,0,0,12.375,22.5ZM20.25,23.625a3.375,3.375,0,0,1,3.375-3.375h6.75a3.375,3.375,0,0,1,3.375,3.375v6.75a3.375,3.375,0,0,1-3.375,3.375h-6.75a3.375,3.375,0,0,1-3.375-3.375ZM23.625,22.5A1.125,1.125,0,0,0,22.5,23.625v6.75A1.125,1.125,0,0,0,23.625,31.5h6.75A1.125,1.125,0,0,0,31.5,30.375v-6.75A1.125,1.125,0,0,0,30.375,22.5Z"\
                    fill="" fill-rule="evenodd" />\
                </g>\
              </svg>\
              <span>Services</span>\
            </a>\
          </li>\
          <li class="d-flex width-100p">\
            <span class="active-effect"></span>\
            <a href="/app/bug">\
         <svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" width="31.5" height="34.875"\
                viewBox="0 0 31.5 34.875">\
                <g id="bug" transform="translate(-2.25 -1.125)">\
                  <path id="Tracé_10" data-name="Tracé 10"\
                    d="M9.8,1.175a1.125,1.125,0,0,1,1.4.749l.655,2.151a11.256,11.256,0,0,1,12.289,0L24.8,1.924a1.125,1.125,0,1,1,2.153.652l-.922,3.042A11.216,11.216,0,0,1,29.25,13.5h1.125A1.125,1.125,0,0,0,31.5,12.375V11.25a1.125,1.125,0,0,1,2.25,0v1.125a3.375,3.375,0,0,1-3.375,3.375H29.25V18h3.375a1.125,1.125,0,0,1,0,2.25H29.25V22.5h1.125a3.375,3.375,0,0,1,3.375,3.375V27a1.125,1.125,0,0,1-2.25,0V25.875a1.125,1.125,0,0,0-1.125-1.125H29.25a11.25,11.25,0,1,1-22.5,0H5.625A1.125,1.125,0,0,0,4.5,25.875V27a1.125,1.125,0,0,1-2.25,0V25.875A3.375,3.375,0,0,1,5.625,22.5H6.75V20.25H3.375a1.125,1.125,0,0,1,0-2.25H6.75V15.75H5.625A3.375,3.375,0,0,1,2.25,12.375V11.25a1.125,1.125,0,0,1,2.25,0v1.125A1.125,1.125,0,0,0,5.625,13.5H6.75A11.224,11.224,0,0,1,9.972,5.618L9.05,2.576a1.125,1.125,0,0,1,.749-1.4ZM9,15.75v9a9,9,0,0,0,7.875,8.933V15.75Zm10.125,0V33.683A9,9,0,0,0,27,24.75v-9ZM27,13.5H9a9,9,0,0,1,18,0Z"\
                    fill="" fill-rule="evenodd" />\
                </g>\
              </svg>\
              <span>Pannes</span>\
            </a>\
          </li>\
          <li class="width-100p d-flex">\
            <span class="active-effect"></span>\
            <a href="/app/setting" id="setting-link">\
              <svg class="items-menu-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30"\
                viewBox="0 0 30 30">\
                <g id="gear" transform="translate(-0.002 -0.001)">\
                  <path id="Tracé_2" data-name="Tracé 2"\
                    d="M16.571,3.049a1.636,1.636,0,0,0-3.139,0l-.176.6A3.512,3.512,0,0,1,8.208,5.738l-.548-.3A1.638,1.638,0,0,0,5.44,7.66l.3.548a3.512,3.512,0,0,1-2.091,5.048l-.6.176a1.636,1.636,0,0,0,0,3.139l.6.176A3.512,3.512,0,0,1,5.738,21.8l-.3.546a1.638,1.638,0,0,0,2.222,2.22l.548-.3a3.512,3.512,0,0,1,5.048,2.093l.176.6a1.636,1.636,0,0,0,3.139,0l.176-.6a3.512,3.512,0,0,1,5.05-2.091l.546.3a1.638,1.638,0,0,0,2.22-2.222l-.3-.546a3.512,3.512,0,0,1,2.093-5.05l.6-.176a1.636,1.636,0,0,0,0-3.139l-.6-.176a3.512,3.512,0,0,1-2.091-5.048l.3-.548a1.638,1.638,0,0,0-2.222-2.22l-.546.3a3.512,3.512,0,0,1-5.05-2.091l-.176-.6Zm-4.937-.531a3.512,3.512,0,0,1,6.736,0l.176.6a1.637,1.637,0,0,0,2.354.975l.548-.3A3.512,3.512,0,0,1,26.21,8.556l-.3.548a1.637,1.637,0,0,0,.975,2.354l.6.176a3.512,3.512,0,0,1,0,6.736l-.6.176a1.637,1.637,0,0,0-.975,2.354l.3.548a3.512,3.512,0,0,1-4.765,4.763l-.548-.3a1.637,1.637,0,0,0-2.354.975l-.176.6a3.512,3.512,0,0,1-6.736,0l-.176-.6A1.637,1.637,0,0,0,9.1,25.91l-.548.3a3.512,3.512,0,0,1-4.763-4.765l.3-.548a1.637,1.637,0,0,0-.975-2.354l-.6-.176a3.512,3.512,0,0,1,0-6.736l.6-.176A1.637,1.637,0,0,0,4.092,9.1l-.3-.548A3.512,3.512,0,0,1,8.557,3.793l.548.3a1.637,1.637,0,0,0,2.354-.975l.176-.6Z"\
                    transform="translate(0 0)" fill="" fill-rule="evenodd" />\
                  <path id="Tracé_3" data-name="Tracé 3"\
                    d="M18,12.946A5.054,5.054,0,1,0,23.053,18,5.053,5.053,0,0,0,18,12.946ZM10.7,18A7.3,7.3,0,1,1,18,25.3,7.3,7.3,0,0,1,10.7,18Z"\
                    transform="translate(-2.998 -2.999)" fill="" fill-rule="evenodd" />\
                </g>\
              </svg>\
              <span>Paramètre</span>\
            </a>\
          </li>\
        </ul>\
      </nav>\
      <!-- Logout Button -->\
      <div class="logout-btn">\
        <svg class="items-menu-icon"\ xmlns="http://www.w3.org/2000/svg" width="27" height="31.5"\
          viewBox="0 0 27 31.5">\
          <g id="logout" transform="translate(-4.5 -2.25)">\
            <path id="Tracé_12" data-name="Tracé 12"\
              d="M6.75,33.75h13.5A2.252,2.252,0,0,0,22.5,31.5V28.125H20.25V31.5H6.75V4.5h13.5V7.875H22.5V4.5a2.252,2.252,0,0,0-2.25-2.25H6.75A2.252,2.252,0,0,0,4.5,4.5v27a2.252,2.252,0,0,0,2.25,2.25Z"\
              fill="" />\
            <path id="Tracé_13" data-name="Tracé 13"\
              d="M23.159,23.159l4.035-4.034H11.25v-2.25H27.194L23.16,12.841l1.59-1.591L31.5,18l-6.75,6.75Z"\
              fill="" />\
          </g>\
        </svg>\
        <span>Déconnexion</span>\
      </div>\
    </div>\
    <!-- Content Bloc -->\
    <div id="content-bloc" class="content-bloc d-flex flex-column">\
      <!-- Header -->\
      <div class="content-bloc-header d-flex justify-content-between">\
        <!-- Page Active Title and Description -->\
        <div class="page-active-info">\
          <div class="page-active-title">\
          </div>\
          <div class="page-active-description">\
            </div>\
        </div>\
        <!-- Notifications -->\
        <div class="alert d-flex justify-content-center align-items-center" id="alert">\
          👋 Bienvenue\
        </div>\
      </div>\
      <!-- Content Page    -->\
      <!-- Dashboard Page -->\
      <section class="content-page" id="content-page">\
      </section>\
    </div>\
  </div>'
  }
  getContentHTML() {
    return new Promise((resolve, reject)=> {
      resolve(this.contentHTML);
    })
  }

  execCode() {
    const navigateTo = url => {
      loadEffect(()=>{
        history.pushState(null, null, url);
      router();
      }, 3000)
      
    };
    const router = async () => {
      const routes = [/* List of front route valid in app */
        {
          path: "/app/dashboard",
          view: DashboardView
        },
        {
          path: "/app/bug",
          view: BugViews
        },
        {
          path: "/app/equipment",
          view: EquipmentsViews
        },
        {
          path: "/app/service",
          view: ServiceViews
        },
        {
          path: "/app/users",
          view: UserViews
        },
      ];
      const potentialMatches = routes.map(route => {
        return {
          route: route,
          isMatch: location.pathname === route.path
        };
      });

      let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

      if (!match) {
     /*   match = {
          route: routes[0],
          isMatch: true
        };*/
        navigateTo("/app/dashboard");
      }
        //Check user before continue
  checkUser();
      //If a active route is / => start screen
      const view = new match.route.view();
      view.getContentHTML().then((content)=> {
        document.querySelector(".page-active-title").innerHTML = view.getTitle();
        document.querySelector(".page-active-description").innerHTML = view.getDescription();
        document.querySelector("#content-page").innerHTML = content;
        view.execCode();
        view.exec_Function();
        logout();
      /*  function(){
          
        }*/
      });
    };
    //Start the router.
    router();
    /* The Popstate Event of the Window interface is fired when the active history entry changes while
the user navigates the session history. It changes the current history entry to that of the last page
the user visited. */
    // We using Event Popstate to navigate on the session history.
    window.addEventListener("popstate", (e)=> {
      router();
    });

    /* After the initial HTML document hes been completly loaded and parsed, without waiting for stylesheets, images and subframes to finish loading. */
 document.querySelector("ul").addEventListener("click", e => {
      e.preventDefault(); /* blocking default click handing*/
      console.log(e.target.closest("a").pathname);
      navigateTo(e.target.closest("a").pathname);
      //and navigate to link of button 
  });
  //Logout user
  
  }
}