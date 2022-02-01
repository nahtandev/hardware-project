import PageViews from "./PageViews.js";
import getCodeSVG from "../js/svg.js";
import FormsView from "./FormsView.js";
import SubInfoView from "./SubInfoView.js";
import TableViews from "./TableViews.js";
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

export class ServiceViews extends PageViews {
  constructor() {
    super ();
    this.title = "Services";
    this. description = "Administrez les services liés à vos équipements";
    this.options = [{
      iconeSvgId: "plug-add",
      name: "Tout les services",
      id: "all-services",
      toExec: {
        position: null,
        function: allServices
      }
    },
      {
        iconeSvgId: "plug-add",
        name: "Ajouter Service",
        id: "add-service",
        toExec: {
          position: null,
          function: addService
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Prestation Échéance",
        id: "expiring-service",
        toExec: {
          position: null,
          function: expiringService
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Tout les prestataires",
        id: "all-service-provider",
        toExec: {
          position: null,
          function: allServicesProviders
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Ajouter prestataire",
        id: "add-service-provider",
        toExec: {
          position: null,
          function: addServiceProvider
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
allServices();
  }
}
//Get all equipment with sql Query
let allEquipmentsQuery = "SELECT * FROM Equipement";
//Response from server and formated

// New Service
function addService() {
  //Get all equipments with ajax_request
  ajax_request("/all-equipments", "POST", new Object({}), response=> {
    let equipmentsOption = [];
    for (let option of response) {
      equipmentsOption.push({
        value: option.ref, 
        name: option.ref+" "+option.designation+" "+option.marque+" "+option.model
      });
    }
    //Get all prestataire
ajax_request("/all-prestataire", "POST", new Object({}), response=> {
    let prestataireOption = [];
    for (let option of response) {
      prestataireOption.push({
        value: option.id, 
        name: option.prestataire
      });
    }
    const NewServiceForms = new FormsView("Nouveau Service", "Renseignez les informations relatif au service et l'équipement concerné.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Tout les équipements"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Tout les équipements",
      id: "all-equipment",
      options: equipmentsOption,
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "end-fieldset"
    },
    {
      type: "fieldset",
      name: "Tout les prestataires"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Tout les prestataires",
      id: "all-service-provider",
      options: prestataireOption,
      width: 100
    },

    {
      type: "end-line"
    },
    {
      type: "end-fieldset"
    },
    {
      type: "end-col"
    },
    {
      type: "col"
    },
    {
      type: "fieldset", name: "Informations services"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Référence",
      typeInput: "text",
      id: "reference-service",
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Date Expiration",
      typeInput: "date",
      id: "date-expiration",
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Type Service",
      typeInput: "text",
      id: "type-service",
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "end-fieldset"
    },
    {
      type: "end-col"
    },
  ]);
  displayBlocOnBottom(NewServiceForms.buildForms()).then(()=>{
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
          ajax_request("/register-service", "POST", new Object({
          reference_equipement: forms.elements["all-equipment"].value,
          id_prestataire: forms.elements["all-service-provider"].value,
          reference_service: forms.elements["reference-service"].value,
          date_expiration: forms.elements["date-expiration"].value,
          type_service: forms.elements["type-service"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          allServices();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Équipement non ajouté.", 6)
        })
        }
      });
  });
  allServices();
  }, failed => {console.log(failed)});
  }, failed => {console.log(failed)});
}


//Function expiring Service
function expiringService() {
  //Execute sql query
  ajax_request("/all-expiring-services", "POST", new Object({}), response=>{
    //Response from Server formated
   let allServicesResponse = formatDataToArray(response, ["id_service", "reference", "type", 'DATE_FORMAT(services.date_exp, "%d/%m/%Y")', "ref_equip"]);
   let AllServiceTable = new TableViews("Tout les serveices arrivant à échéance", true, ["ID", "Reference Prestation", "Type", "Reference Équipement", "Date Expiration"], allServicesResponse);
  //Build table and display
  AllServiceTable.buildTable().then((table)=> {
    console.log(table);
    displayBlocOnTop('<div class="table-bloc">'+table+'</table>').then(()=> {
      //Active search for this table.
      AllServiceTable.search();
      //Get primary key to send query
      AllServiceTable.getPrimaryKey().then((primaryKey) => {
        //Execute sql query after get primary Key and return response
ajax_request("/infos-of-service", "POST", new Object({refService: primaryKey}), sqlResponse=>{
          function buildSubInfoView() {
          //Format title using value
          let title = sqlResponse[0].type;
          //Format description using value
          let description = sqlResponse[0].reference;
          //Format fields array
          let fields = [{
            type: "col"
          },
            {
              type: "fieldset", name: "Informations Prestations"
            },
            {
              type: "item",
              name: "Date d'expiration",
              value: sqlResponse[0]['DATE_FORMAT(services.date_exp, "%d/%m/%Y")']
            },
            {
              type: "item",
              name: "Prestataire",
              value: sqlResponse[0].prestataire
            },
            {
              type: "item",
              name: "Adresse Prestataire",
              value: sqlResponse[0].adresse
            },
            {
              type: "end-fieldset"
            },
            {
              type: "end-col"
            },
            {
              type: "col"
            },
            {
              type: "fieldset",
              name: "Équipement concerné"
            },
            {
              type: "item",
              name: "Référence",
              value: sqlResponse[0].ref_equip
            },
            {
              type: "item",
              name: "Designation",
              value: sqlResponse[0].designation
            },
            {
              type: "item",
              name: "Marque",
              value: sqlResponse[0].marque
            },
            {
              type: "item",
              name: "Model",
              value: sqlResponse[0].model
            },
            {
              type: "end-fieldset"
            },
            {
              type: "end-col"
            }];
          //Declare subInfoView object to display Informations on Equipment selected
          const subInfoView = new SubInfoView(title, description, {
            id: "close-view", type: "btn", value: "Fermer"
          }, fields)
          return subInfoView.buildSubInfoView();
        }
        displayBlocOnBottom(buildSubInfoView()).then(()=>{closeView();});
        expiringService();
}, failed=>{console.log(failed)});
      });
    })
  });
  }, failed=>{console.log(failed)});
}


//All Service bloc
//Function expiring Service
function allServices() {
  //Execute sql query
  ajax_request("/all-services", "POST", new Object({}), response=>{
    //Response from Server formated
   let allServicesResponse = formatDataToArray(response, ["id_service", "reference", "type", 'DATE_FORMAT(services.date_exp, "%d/%m/%Y")', "ref_equip"]);
   let AllServiceTable = new TableViews("Tout les services enregistrés", true, ["ID", "Reference Prestation", "Type", "Reference Équipement", "Date Expiration"], allServicesResponse);
  //Build table and display
  AllServiceTable.buildTable().then((table)=> {
    console.log(table);
    displayBlocOnTop('<div class="table-bloc">'+table+'</table>').then(()=> {
      //Active search for this table.
      AllServiceTable.search();
      //Get primary key to send query
      AllServiceTable.getPrimaryKey().then((primaryKey) => {
        //Execute sql query after get primary Key and return response
ajax_request("/infos-of-service", "POST", new Object({refService: primaryKey}), sqlResponse=>{
          function buildSubInfoView() {
          //Format title using value
          let title = sqlResponse[0].type;
          //Format description using value
          let description = sqlResponse[0].reference;
          //Format fields array
          let fields = [{
            type: "col"
          },
            {
              type: "fieldset", name: "Informations Prestations"
            },
            {
              type: "item",
              name: "Date d'expiration",
              value: sqlResponse[0]['DATE_FORMAT(services.date_exp, "%d/%m/%Y")']
            },
            {
              type: "item",
              name: "Prestataire",
              value: sqlResponse[0].prestataire
            },
            {
              type: "item",
              name: "Adresse Prestataire",
              value: sqlResponse[0].adresse
            },
            {
              type: "end-fieldset"
            },
            {
              type: "end-col"
            },
            {
              type: "col"
            },
            {
              type: "fieldset",
              name: "Équipement concerné"
            },
            {
              type: "item",
              name: "Référence",
              value: sqlResponse[0].ref_equip
            },
            {
              type: "item",
              name: "Designation",
              value: sqlResponse[0].designation
            },
            {
              type: "item",
              name: "Marque",
              value: sqlResponse[0].marque
            },
            {
              type: "item",
              name: "Model",
              value: sqlResponse[0].model
            },
            {
              type: "end-fieldset"
            },
            {
              type: "end-col"
            }];
          //Declare subInfoView object to display Informations on Equipment selected
          const subInfoView = new SubInfoView(title, description, {
            id: "close-view", type: "btn", value: "Fermer"
          }, fields)
          return subInfoView.buildSubInfoView();
        }
        displayBlocOnBottom(buildSubInfoView()).then(()=>{closeView();});
        allServices();
}, failed=>{console.log(failed)});
      });
    })
  });
  }, failed=>{console.log(failed)});
}

//All Service provider bloc
function allServicesProviders() {
  //sql query return this response
ajax_request("/all-prestataire", "POST", new Object({}), response=>{
  let allServicesProvidersResponse = formatDataToArray(response, ["id", "prestataire", "adresse"]);
  let AllServiceProviderTable = new TableViews("Tout les prestataires de services enregistrés", true, ["ID", "Nom", "Adresse"], allServicesProvidersResponse);
  //Build table and display
  AllServiceProviderTable.buildTable().then((table)=> {
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
    console.log(table);
      //Active search for this table.
      AllServiceProviderTable.search();
    });
  });
}, failed=>{console.log(failed)});
}

// New Service Provider
function addServiceProvider() {
  const NewServiceProviderForms = new FormsView("Nouveau Prestataire", "Renseignez les informations relatif au prestataire.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Informations Prestataire"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Nom",
      typeInput: "text",
      id: "nom-service-provider",
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Adresse",
      typeInput: "text",
      id: "adresse-prestataire",
      width: 100
    },
    {
      type: "end-line"
    },
    {
      type: "end-fieldset"
    },
    {
      type: "end-col"
    },
  ]);
  displayBlocOnBottom(NewServiceProviderForms.buildForms()).then(()=>{
            //Control forms to send data with ajax query
      let submitBtn = document.getElementById("forms-submit-btn");
      submitBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let forms = document.querySelector("form");
        //Check each input of forms
let isCheck = false;
        for (let field of forms.elements) {
          // Filter fields form and get Id input and passwords input
          if (field.type == "text") {
            //Check if value of input is enter
            if (field.value == "") {
              //If value of input is not entered, display alert to inform user.
              displayAlert("reveal-error", "Un champs est vide.", 6); break;
            }else{
              isCheck=true;
            }
          }}
          if(isCheck){
        ajax_request("/register-service-provider", "POST", new Object({
          name: forms.elements["nom-service-provider"].value,
          adresse: forms.elements["adresse-prestataire"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          allServicesProviders();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Prestataire non ajouté.", 6)
        })
          }
  });
  });
  allServicesProviders();
}
