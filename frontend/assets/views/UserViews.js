import PageViews from "./PageViews.js";
import getCodeSVG from "../js/svg.js";
import FormsView from "./FormsView.js";
import SubInfoView from "./SubInfoView.js";
import {
  affectedEquipment
} from "./EquipmentsView.js"
import TableViews from "./TableViews.js";
import loadEffect  from "./basic_function.js";
import {
  animateLoading
}  from "./basic_function.js";
import {
  displayAlert
} from "./basic_function.js"
import {displayBlocOnBottom} from "./basic_function.js";
import {displayBlocOnTop} from "./basic_function.js";
import {closeView} from "./basic_function.js";
import {ajax_request} from "./basic_function.js";
import {formatDataToArray} from "./basic_function.js";
import {displayWelcomeText} from "./basic_function.js";
export class UserViews extends PageViews {
  constructor() {
    super ();
    this.title = "Utilisateurs";
    this. description = "Gérez tout les utilisateurs et les affectations d'équipements.";
    this.options = [
      {
        iconeSvgId: "plug-add",
        name: "Tout les utilisateurs",
        id: "all-users-registered",
        toExec: {
          position: null,
          function: allUser
        }
      },
      {
      iconeSvgId: "plug-add",
      name: "Nouvel Utilisateur",
      id: "new-user",
      toExec: {
        position: null,
        function: newUser
      }
    },
      {
        iconeSvgId: "plug-add",
        name: "Affecter Équipement",
        id: "assign-equipment",
        toExec: {
          position: null,
          function: assignEquipment
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Desaffecter Equipement",
        id: "disassign-equipment",
        toExec: {
          position: null,
          function: disassignEquipment
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
    };}
    execCode(){
      document.getElementById("content-page").classList.remove("flex-column");
      document.getElementById("content-page").classList.add("d-flex", "justify-content-between");
      displayWelcomeText();
allUser();
    }
}

// New User Function
function newUser() {
  //Test Add equiment forms
  const NewUserForms = new FormsView("Nouvel Utilisateur", "Renseignez les informations concernant l'utilisateur et valider.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Informations Utilisateurs"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Nom",
      typeInput: "text",
      id: "nom-user",
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
      name: "Prénom",
      typeInput: "text",
      id: "prenom-user",
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
    }]);
  displayBlocOnBottom(NewUserForms.buildForms()).then(()=>{
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
        ajax_request("/register-user", "POST", new Object({
          lastname: forms.elements["nom-user"].value,
          firstname: forms.elements["prenom-user"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          allUser();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Utilisateur non ajouté.", 6)
        })
          }
  });
  });
  allUser();
}

//Assign user to equipment...
function assignEquipment() {
  //Get all users.
ajax_request("/all-user", "POST", new Object({}), allUserResponse=>{
  //Format data get on server to display in select.
  let optionsAllUsers = [];
  for (let option of allUserResponse) {
  optionsAllUsers.push({value: option.id_utilisateur, name: option.nom+" "+option.prenom});
}

//Get all equipment is not assign with sql query
ajax_request("/equipments-not-assign", "POST", new Object({}), equipmentNotAssignResponse=>{
  //Format data to display equipment on select
  let optionsEquipmentNotAssign = [];
for (let option of equipmentNotAssignResponse) {
  optionsEquipmentNotAssign.push({value: option.ref, name: option.ref+" "+option.designation+" "+option.marque+" "+option.model});
}

//After get all informations on database, build forms
const AssignEquipmentForms = new FormsView("Nouvel Assignation d'equipements", "Selectionner l'équipement et l'utilisateur puis valider.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset",
      name: "Tout les Utilisateurs"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Tout les utilisateurs",
      id: "all-users",
      options: optionsAllUsers,
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
      type: "fieldset",
      name: "Équipements non affectés"
    },
    {
      type: "line"
    },
    {
      type: "select",
      name: "Équipements non affectés",
      id: "all-equipment-not-affected",
      options: optionsEquipmentNotAssign,
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
    }]);
  displayBlocOnBottom(AssignEquipmentForms.buildForms()).then(()=>{
          //Control forms to send data with ajax query
      let submitBtn = document.getElementById("forms-submit-btn");
      submitBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let forms = document.querySelector("form");
        //Check each input of forms
let isCheck = false;
        for (let field of forms.elements) {
          // Filter forms to get select only
          if (field.type == "select-one") {
            //Check if value of input is enter
            if (field.value == "") {
              //If value of input is not entered, display alert to inform user.
              displayAlert("reveal-error", "Un champs est vide.", 6); break;
            }else{
              isCheck=true;
            }
          }}
          if(isCheck){
        ajax_request("/assign-equipment", "POST", new Object({
          idUser: forms.elements["all-users"].value,
          refEquip: forms.elements["all-equipment-not-affected"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          affectedEquipment();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Effectué", 6)
        })
          }
  });
  });
  affectedEquipment();
}, failed=>{displayAlert("reveal-error", "Equipments not get, please reload page")});
}, failed=>{displayAlert("reveal-error", "User not get, please reload page", 6)});
}

//Disassign Equipment bloc
//Function affectedEquipment
function disassignEquipment() {
    //Query to get all Equipment Affected.
  ajax_request("/all-equipments-affected", "POST", new Object({}),
    //If sql response is ready
    response=> {
      //Get data is format to send on table.
      let allEquipmentAffectedResponse = formatDataToArray(response,
        ["ref",
          "designation",
          "marque",
          "model",
          "nom",
          "prenom",
          'DATE_FORMAT(affectation.date_debut, "%d/%m/%Y")']);
      let newArrayField = [];
      allEquipmentAffectedResponse.map((el)=> {
        //Reformat array contain data for join user first-name and last-name
        let line = [];
        line.push(el[0]);
        line.push(el[1]);
        line.push(el[2]);
        line.push(el[3]);
        line.push(el[4]+" "+el[5]);
        line.push(el[6]);
        newArrayField.push(line);
      });
         //Affected Equipment Table
      let AffectedEquipmentTable = new TableViews("Tout les équipements affectés et leurs utilisateurs", true, ["Reference", "Désignation", "Marque", "Model", "Utilisateur", "Depuis"], newArrayField);
      //Build table and display
  //Build table and display
  AffectedEquipmentTable.buildTable().then((table)=> {
    console.log(table);
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
      //Active search for this table.
      AffectedEquipmentTable.search();
      //Get primary key to send query
      AffectedEquipmentTable.getPrimaryKey().then((primaryKey) => {
        //Execute sql query after get primary Key and return response

          //Declare subInfoView object to display Informations on Equipment selected
ajax_request("/infos-equipment-affected", "POST", new Object({
              equipRef: primaryKey
            }), sqlResponse => {
              function buildSubInfoView() {
                //Format title using value
                let title = sqlResponse[0].designation +" " +  sqlResponse[0].marque + " "+ sqlResponse[0].model;
                //Format description using value
                let description = sqlResponse[0].ref + ", " + sqlResponse[0].etat_utilisation;
                //Format fields array
                let fields = [{
                  type: "col"
                },
                  {
                    type: "fieldset",
                    name: "Informations Equipments"
                  },
                  {
                    type: "item",
                    name: "Caractéristiques \
          Techniques",
                    value: sqlResponse[0].carac_technique
                  },
                  {
                    type: "item",
                    name: "Etat achat",
                    value: sqlResponse[0].etat_achat
                  },
                  {
                    type: "item",
                    name: "Prix achat",
                    value: sqlResponse[0].prix_achat
                  },
                  {
                    type: "item",
                    name: "Date Achat",
                    value: sqlResponse[0]['DATE_FORMAT(equipments.date_achat, "%d/%m/%Y")']
                  },
                  {
                    type: "item",
                    name: "Fournisseur",
                    value: sqlResponse[0].nom_fournisseur+", "+sqlResponse[0].adresse_fournisseur
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
                    name: "Informations Utilisation"
                  },
                  {
                    type: "item",
                    name: "Affecté depuis le",
                    value: sqlResponse[0]['DATE_FORMAT(affectation.date_debut, "%d/%m/%Y")']
                  },
                  {
                    type: "item",
                    name: "Utilisateur",
                    value: sqlResponse[0].nom+" "+sqlResponse[0].prenom
                  },
                  {
                    type: "end-fieldset"
                  },
                  {
                    type: "end-col"
                  }];
          const subInfoView = new SubInfoView(title, description, {
            id: "disassign_equipment", type: "btn", value: "Désaffecter"
          }, fields)
          return subInfoView.buildSubInfoView();
        }
        displayBlocOnBottom(buildSubInfoView()).then(()=> {
          function disassignEquip() {
            document.getElementById("disassign_equipment").addEventListener("click", ()=> {
      console.log(primaryKey);
      ajax_request("/remove-equipment-to-affectation", "POST", new Object({refEquip: primaryKey}), serverResponse=>{
       displayAlert("reveal-error", "Desaffectation Effectué avec succès", 10);
       displayBlocOnBottom("Selectionnez un équipement pour le retirer d'affectation")
       disassignEquipment();
      }, failed=>{
        console.log(failed);
      });
              
            });
          }
          disassignEquip();
          disassignEquipment();
        
        });
            }, failed=>{console.log(failed)});
      });
    });
  });   
      
    }, failed=>{console.log(failed)});
}


//All user bloc
function allUser() {
 //Execute sql query
  ajax_request("/all-user", "POST", new Object({}), response=> {
    console.table(response);
    //Responsew formated from server
let allUserResponse = formatDataToArray(response, ["id_utilisateur", "nom", "prenom"]);
//Table of user
let AllUserTable = new TableViews("Tout les utilisateurs enregistrés", true, ["ID", "Nom", "Prenom"], allUserResponse);
  //Build Table and
  AllUserTable.buildTable().then((table) => {
    //Display this.
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
      //Active searh bar
      AllUserTable.search();
      //Get primary key to exec sql query
      AllUserTable.getPrimaryKey().then((primaryKey)=> {
        //Execute sql query after get primary Key and return response
        ajax_request("/equipments-of-user", "POST", new Object({idUser: primaryKey}), userResponse=>{
          //If user have no Equipement affected
           if(userResponse.length==0){
             displayBlocOnBottom("Aucun équipement affecté à cet utilisateur.").then(()=>allUser());
           }
           //If user has Equipement affected
           else {
             let sqlResponse = {
          nom: userResponse[0].nom,
          prenom: userResponse[0].prenom,
          equipmentUsed: formatDataToArray(userResponse, ["designation", "marque", "model"])
        };
        function buildSubInfoView() {
        let EquipmentsToAffectedTable = new TableViews("Équipements affectés à "+sqlResponse.nom+" "+sqlResponse.prenom, true, ["Désignation", "Marque", "Model"], sqlResponse.equipmentUsed);
          EquipmentsToAffectedTable.buildTable().then((table)=> {
            displayBlocOnBottom('<div class="table-bloc">' + table +'</div>');
          });
        }
        buildSubInfoView();
        allUser();
           }
        }, failed=>{displayAlert("reveal-error", "Erreur dans la requête, réessayer", 6);});
      });
    });
  });
  }, failed=>{displayAlert("reveal-error", "Erreur de requête", 6)});


}