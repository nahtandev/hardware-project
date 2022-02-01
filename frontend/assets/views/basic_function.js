import {
  navigateTo
} from "../js/script.js";
//Progress bar animate
export default function loadEffect(func, times) {
  document.querySelector(".loader").style.display = "block";
  document.querySelector(".progress-bar").style.display = "block";
  document.querySelector(".progress").style.animation = 'loader '+times/1000+'s infinite';
  setTimeout(function() {
    document.querySelector(".progress-bar").style.display = "none";
    func()
    document.querySelector(".loader").style.display = "none";
  }, times);
}

  // Animate loading
  export function animateLoading() {
    let loadingText = "Chargement...";
    let splitText = loadingText.split('');
    let animateText = '<div class="d-flex justify-content-center align-items-center loading-text"><div>Veuillez patienter,  </div>';
    for (let i = 0; i < splitText.length; i++) {
      animateText += '<span style="--i:';
      animateText += (i+1).toString();
      animateText += '">' + splitText[i]+'</span>';
    }
    animateText += '</div>';
    return (animateText);
  }

  //Alert function
  export function displayAlert(keyFrame, valueToAlert, timeToDisplay) {
    let alertBloc = document.getElementById("alert");
    alertBloc.style.display = "flex";
    alertBloc.innerHTML = valueToAlert;
    alertBloc.style.animation = keyFrame +" "+ timeToDisplay + "s";
    setTimeout(function() {
      alertBloc.style.display = "none";
    }, timeToDisplay*1000);
  }

  export function displayWelcomeText() {
    document.getElementById("top-content-bloc").innerHTML = '<span class="welcome-text">Cliquez sur une option pour continuer...</span><div class="arrow-5"></div>';
  }

  //This function display content on bottom  bloc
  export function displayBlocOnBottom(toDisplay) {
    return new Promise((resolve, reject)=> {
      loadEffect(()=> {
   /*     document.getElementById("bottom-content-bloc").innerHTML = animateLoading();*/
     //   setTimeout(function() {
          document.getElementById("bottom-content-bloc").innerHTML = toDisplay;
          resolve(true);
//        },
 //         4000);
      }, 1500);
    })}

  //This function display content on top bloc
  export function displayBlocOnTop(toDisplay) {
    return new Promise((resolve,
      reject) => {
      console.log(toDisplay)
      loadEffect(()=> {
     /*   document.getElementById("top-content-bloc").innerHTML = animateLoading();*/
    //    setTimeout(function() {
          document.getElementById("top-content-bloc").innerHTML = toDisplay;
          resolve(true);
  //      },
 //         4000);
      }, 1500)
    })}

  //This function close sub info view
  export function closeView() {
    document.getElementById("close-view").addEventListener("click", ()=> {
      document.getElementById("bottom-content-bloc").innerHTML = "Veuillez sélectionner un element pour voir plus de détails";
    });
  }

  export function execJSCode(nodeHTML, path, toExec) {
    //Select final node to observe.
    let finalNode = document.querySelector(nodeHTML);
    // Create observer instance.
    let observer = new MutationObserver(function(mutations) {
      for (let mutation of mutations) {
        if (mutation.type == 'childList' && (location.pathname == path)) {
          toExec();
          break;
        }
        /* if (mutation.type == 'childList' && (location.pathname != path)) {
        let routes=["/", "/app", "/auth"];
        let routeNotGet=true;
        for(let route of routes){
          if (location.pathname!=route)
            routeNotGet=false;
        }
      if (!routeNotGet) {
        console.log(location.pathname)
        //toExec();
        } }*/
      }})

    //Configure observer:
    let config = {
      attributs: true, childList: true, characterData: true
    };
    //Start observer
    observer.observe(finalNode,
      config);
    //Disconnect observer
    //observer.disconnect();
  }

  export function checkUser() {
    //After display the start screen, redirect user to authentification screen.
    //Check if the user is connected by checking the presence of local connection variables.
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (userCredentials) {
      console.log(userCredentials["id"])
      ajax_request("/connect-admin", "POST", new Object({
        identifiant: userCredentials.id, password: userCredentials.password
      }), serverData=> {
        if (serverData.isConnect == true) {
          if (location.pathname == "/")
            navigateTo("/app")
        } else {
          displayAlert("reveal-error", "Authentification requis.", 5);
          navigateTo("/auth")
        }
      },
        error=> {
          displayAlert("reveal-error", "Erreur de demande, Reessayez.", 5)})
      // If user is authentified, redirect user to AppViews
    }
    //If user is not connected
    else {
      displayAlert("reveal-error", "Authentification requis!", 4)
      navigateTo("/auth")
    }
  }

//Logout
export function logout(){
  document.querySelector(".logout-btn").addEventListener("click", ()=>{
    localStorage.removeItem("userCredentials");
   console.log(localStorage.getItem("userCredentials"));
    checkUser();
  });
}
  // Makes some ajax request with a link and his data.

  export function ajax_request(link, method, data, success = null, failed = null) {

    // Creating a new "xml http request" and Opens the xhr with the passed parameters.
    let xhr = new XMLHttpRequest(); xhr.open(method, link, true);
    // Changes the default header.
    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    // Sends the passed data.
    xhr.send(JSON.stringify(data)); xhr.onload = () => {
      // A 200 status has been returned.
      if (xhr.status === 200) success(JSON.parse(xhr.responseText), xhr.status);
      // Otherwise.
      else failed(xhr.status);
    }
  }
  
  //This function format json array from server to array.
  export function formatDataToArray(jsonData, fields){
    let arrayData=[];
    for (let data of jsonData){
      let row=[];
      for (let property in data){
        for(let field of fields){
          if(property == field)
            row.push(data[property]);
        }
      }
     arrayData.push(row);
    }
    return arrayData;
  }