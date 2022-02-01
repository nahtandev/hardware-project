import {
  animateLoading
} from "./basic_function.js";
import loadEffect from "./basic_function.js";
import {
  displayAlert
} from "./basic_function.js";
import {
  navigateTo
} from "../js/script.js";
import {
  ajax_request
} from "./basic_function.js";

export class AuthViews {
  constructor(title, contentHTML, codeJS) {
    this.title = "Authentification";
    this.contentHTML = '<div class="progress-bar"><span class="bar"><span class="progress"></span></span></div><div class="loader">Loading...</div><div id="auth-bloc" class="auth-bloc d-flex align-items-center flex-column"><div class="d-flex justify-content-between  logo-start-screen"><div>hard</div><div>ware</div></div><div class="auth-options d-flex justify-content-between"><div class="sign-in" id="sign-in">Connexion</div><div class="register" id="register">S\'inscrire</div></div><div class="auth-forms"></div></div>';
  }
  getContentHTML() {
    return new Promise((resolve, reject)=> {
      resolve(this.contentHTML);
    })}

  execCode() {
    //Wait the auth page is display,
    //execJSCode("body", "/auth", ()=> {
    console.log("Auth vuzw")
    const authOptions = [{
      name: "S'inscrire",
      isActive: true,
      id: "register",
      forms: '<form action="/register-admin" method="post" accept-charset="utf-8"> <input type = "text" name = "identifiant" id = "identifiant" value = "" placeholder = "Identifiant ou Email" required = ""/><input type="password" name="password" id="password" value="" placeholder="Mot de passe" required="" /><input type="password" name="password-confirm" id="password-confirm" value="" placeholder="Confirmer Mot de passe" required="" /> <button id="submit-login" type="submit">Valider</button></form>'
    },
      {
        name: "Connexion",
        isActive: false,
        id: "sign-in",
        forms: '<form action="" method="post" accept-charset="utf-8"> <input type = "text" name = "identifiant" id = "identifiant" value = "" placeholder = "Identifiant ou Email" required = ""/><input type="password" name="password" id="password" value="" placeholder="Mot de passe" required="" /><button id="submit-login" type="submit">Valider</button></form>'
      }];
    authOptions.map((option)=> {
      let potentialOption = document.getElementById(option.id);
      potentialOption.addEventListener("click", ()=> {
        // After click reset all option
        for (let notPotentialOption of authOptions) {
          document.getElementById(notPotentialOption.id).classList.remove("auth-option-active")
        }
        //Active function is click
        option.isActive = true;
        //If one option is active or is click
        if (option.isActive) {
          loadEffect(()=> {
            potentialOption.classList.add("auth-option-active");
            displayForms(option.forms).then((a)=> {
              //Control form.
              let btn = document.getElementById("submit-login");
              btn.addEventListener("click", (e)=> {
                e.preventDefault();
                let forms = document.querySelector("form");
                //Check each input of forms
                for (let field of forms.elements) {
                  // Filter fields form and get Id input and passwords input
                  if (field.type == "text" || field.type == "password") {
                    //Check if value of input is enter
                    if (field.value == "") {
                      //If value of input is not entered, display alert to inform user.
                      displayAlert("reveal-error", "Un champs est vide.", 6); break;
                    }}}
                //Check sign in forms
                if (option.id == "register") {
                  let userId = forms.elements["identifiant"].value;
                  let userPassword = forms.elements["password"].value;
                  let passwordConfirm = forms.elements["password-confirm"].value;

                  //and run check
                  if (userPassword != passwordConfirm) {
                    displayAlert("reveal-error", "Mots de passe différents", 6);

                  } else {
                    //Make ajax query to insert admin credentials.
                    ajax_request("/register-admin", "POST", {
                      identifiant: userId, password: userPassword
                    }, serverData=> {
                      //If query is succeful send alert to user.
                      displayAlert("reveal", serverData.status, 4)
                      //After display alert, redirect to auth.
                      navigateTo("/auth")
                    }, failed=> {
                      //If query is fail, Display alert to user.
                      displayAlert("reveal-error", "Echec de l'opération, Reesayez.", 4)
                    })
                  }

                }
                if (option.id == "sign-in") {
                  let userId = forms.elements["identifiant"].value;
                  let userPassword = forms.elements["password"].value;
                  //Use sql query to get all user id and password
                  ajax_request("/connect-admin", "POST", new Object({
                    identifiant: userId, password: userPassword
                  }), serverData=> {
                    if (serverData.isConnect == true) {
                      let userCredentials = {
                        id: userId,
                        password: userPassword
                      }
                      localStorage.setItem("userCredentials", JSON.stringify(userCredentials))
                      console.log(localStorage.getItem("userCredentials"));
                      displayAlert("reveal", "Connexion Effectué", 4);
                      navigateTo("/app")
                    } else {
                      displayAlert("reveal-error", "Identifiant ou Mot de passe non valide.", 6);
                    }
                  },
                    error=> {
                      displayAlert("reveal-error", "Erreur de demande, Reessayez.", 5)})
                  //and run check

                }

              })


            })
          }, 3000);
        }
      });
      /*     if (option.isActive) {
        loadEffect(()=> {
          potentialOption.classList.add("auth-option-active");

        }, 3000);
      }*/
    });
    //Function to display forms
    function displayForms(forms) {
      return new Promise((resolve, reject) => {
        document.querySelector(".auth-forms").innerHTML = forms;
        resolve(true);
      });
    }
    //});
  }
}