import PageViews from "./PageViews.js";
import FormsView from "./FormsView.js";
import SubInfoView from "./SubInfoView.js";
import TableViews from "./TableViews.js";
import {equipmentOffline} from "./EquipmentsView.js";
import loadEffect  from "./basic_function.js";
import {
  animateLoading
}  from "./basic_function.js";
import {
  displayAlert
} from "./basic_function.js";
import {displayBlocOnBottom} from "./basic_function.js";
import {displayBlocOnTop} from "./basic_function.js";
import {closeView} from "./basic_function.js";
import {displayWelcomeText} from "./basic_function.js";
import {ajax_request} from "./basic_function.js";
import {formatDataToArray} from "./basic_function.js";
export class BugViews extends PageViews {
  constructor() {
    super ();
    this.title = "Pannes";
    this. description = "Pannes & Solutions de vos équipements";
    this.options = [{
      iconeSvgId: "plug-add",
      name: "Equipements en maintenance",
      id: "bug-equipments",
      toExec: {
        position: null,
        function: equipmentOffline
      }
    },
      {
        iconeSvgId: "plug-add",
        name: "Enregistrer Panne",
        id: "register-bug",
        toExec: {
          position: null,
          function: registerBug
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Enregistrer Solution",
        id: "register-solution",
        toExec: {
          position: null,
          function: registerSolution
        }
      },
    ];
    this.contentHTML = (html="") => {
      //dynamic-bloc is a bloc to display the various content.
      html += '<div id="dynamic-bloc">';
      //Top content bloc
      html += '<div id="top-content-bloc" class="d-flex justify-content-center align-items-center">' + '</div>';
      //Bottom content bloc
      html += '<div id="bottom-content-bloc" class="d-flex justify-content-center align-items-center">' +'</div>';
      // End dynamic-bloc
      html += '</div>';
      html += '<div class="page-option-bloc d-flex align-items-center flex-column">';
      html += this.buildOptionsView();
      html += '</div>';
      return html;
    };
  }
  execCode(){
    document.getElementById("content-page").classList.remove("flex-column");
    document.getElementById("content-page").classList.add("d-flex", "justify-content-between");
    displayWelcomeText();
    equipmentOffline();
  }
}
// New Solution
function registerSolution() {
  //Get all equipment offline with sql Query
ajax_request("/all-equipments-offline", "POST", new Object({}), response=>{
  //  Format allEquipmentsAffectedResponse to display in select.
let allEquipmentsOfflineOptions = [];
for (let option of response) {
  allEquipmentsOfflineOptions.push({value: option.id_pro, 
  name: option.ref +" "+option.designation+" "+option.marque+" "+option.model});
  
  //New solution forms
const RegisterSolutionForms = new FormsView("Enregistrer Solution", "Renseignez la description de la Solution.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Tout les équipements en maintenance"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Équipements en maintenance",
      id: "all-equipment-offline",
      options: allEquipmentsOfflineOptions,
      width: 100
    },
    {
      type: "end-line"
    },
    { type: "end-fieldset" },
    { type: "end-col" },
    { type: "col" },
    {
      type: "fieldset",
      name: "Informations Solution"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Description Solution",
      id: "description-solution",
      typeInput: "text",
      width: 100
    },
    { type: "end-line" },
    { type: "line" },
    {
      type: "input",
      name: "Date Remise en service",
      id: "date-remise",
      typeInput: "date",
      width: 100
    },
    { type: "end-line" },
    {
      type: "end-fieldset"
    },
    {
      type: "end-col"
    }
  ]);
  displayBlocOnBottom(RegisterSolutionForms.buildForms()).then(()=>{
    let submitBtn = document.getElementById("forms-submit-btn");
      submitBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let forms = document.querySelector("form");
        //Check each input of forms
let isCheck = false;
        for (let field of forms.elements) {
          // Filter fields form and get Id input and passwords input
          if (field.type == "text" || field.type == "number" || field.type == "date" || field.type == "select-one") {
            //Check if value of input is enter
            if (field.value == "") {
              //If value of input is not entered, display alert to inform user.
              displayAlert("reveal-error", "Un champs est vide.", 6); break;
            }else{isCheck=true}
          }}
        if(isCheck){
          ajax_request("/register-solution", "POST", new Object({
          id_probleme: forms.elements["all-equipment-offline"].value,
          description_solution: forms.elements["description-solution"].value,
          date_remise: forms.elements["date-remise"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          equipmentOffline();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Solution non enregistrée.", 6);
        });
        }
      });
  });
  equipmentOffline();
}}, failed=>{console.log(failed)});
}

// New Bug
function registerBug() {
  //Get all equipment affectected with sql Query
ajax_request("/all-equipments-affected", "POST", new Object({}), response=>{
  //  Format allEquipmentsAffectedResponse to display in select.
let allEquipmentsAffectedOptions = [];
for (let option of response) {
  allEquipmentsAffectedOptions.push({value: option.id_affect, 
  name: option.ref +" "+option.designation+" "+option.marque+" "+option.model});
}

const NewBugForms = new FormsView("Nouvel Panne", "Renseignez les informations relatif à l'équipement et la panne.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Tout les équipements affectés"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Tout les équipements affectés",
      id: "all-equipment-affected",
      options: allEquipmentsAffectedOptions,
      width: 100
    },
    {
      type: "end-line"
    },
    { type: "end-fieldset" },
    { type: "end-col" },
    { type: "col" },
    {
      type: "fieldset",
      name: "Informations Pannes"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Description Panne",
      id: "description-panne",
      typeInput: "text",
      width: 100
    },
    { type: "end-line" },
    { type: "line" },
    {
      type: "input",
      name: "Date Panne",
      id: "date-panne",
      typeInput: "date",
      width: 100
    },
    { type: "end-line" },
    {
      type: "end-fieldset"
    },
    {
      type: "end-col"
    }
  ]);
  displayBlocOnBottom(NewBugForms.buildForms()).then(()=>{
    let submitBtn = document.getElementById("forms-submit-btn");
      submitBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let forms = document.querySelector("form");
        //Check each input of forms
let isCheck = false;
        for (let field of forms.elements) {
          // Filter fields form and get Id input and passwords input
          if (field.type == "text" || field.type == "number" || field.type == "date" || field.type == "select-one") {
            //Check if value of input is enter
            if (field.value == "") {
              //If value of input is not entered, display alert to inform user.
              displayAlert("reveal-error", "Un champs est vide.", 6); break;
            }else{isCheck=true}
          }}
        if(isCheck){
          ajax_request("/register-bug", "POST", new Object({
          id_affectation: forms.elements["all-equipment-affected"].value,
          description_panne: forms.elements["description-panne"].value,
          date_panne: forms.elements["date-panne"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          equipmentOffline();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Panne non enregistrée.", 6)
        })
        }
      });
  });
}, failed=>{console.log(failed)});
  
  equipmentOffline();
}