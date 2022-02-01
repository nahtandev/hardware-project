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
} from "./basic_function.js"
import {
  displayBlocOnBottom
} from "./basic_function.js";
import {
  displayBlocOnTop
} from "./basic_function.js";
import {
  closeView
} from "./basic_function.js";
import {
  displayWelcomeText
} from "./basic_function.js";
import {
  ajax_request
} from "./basic_function.js";
import {
  formatDataToArray
} from "./basic_function.js";

export class EquipmentsViews extends PageViews {
  constructor() {
    super ();
    this.title = "Equipments";
    this. description = "Gérez tout vos équipements depuis cet écran.";
    this.options = [{
      iconeSvgId: "plug-add",
      name: "Nouvel Équipement",
      id: "new-equipment",
      toExec: {
        position: null,
        function: newEquipment
      }
    },
      {
        iconeSvgId: "plug-add",
        name: "Equipments Affectés",
        id: "equipment-running",
        toExec: {
          position: null,
          function: affectedEquipment
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Equipement en maintenance",
        id: "equipment-offline",
        toExec: {
          position: null,
          function: equipmentOffline
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Historique Equipement",
        id: "equipment-history",
        toExec: {
          position: null,
          function: historyEquipment
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Retirer Equipement",
        id: "remove-equipment",
        toExec: {
          position: null,
          function: removeEquipment
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Tout les Fournisseurs",
        id: "provider",
        toExec: {
          position: null,
          function: allProvider
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Ajouter Fournisseur",
        id: "add-provider",
        toExec: {
          position: null,
          function: addProvider
        }
      },
      {
        iconeSvgId: "plug-add",
        name: "Fournisseurs défaillants",
        id: "provider-bug",
        toExec: {
          position: null,
          function: allProviderBug
        }
      }];
    this.contentHTML = (html = "") => {
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

  execCode() {
    document.getElementById("content-page").classList.remove("flex-column");
    document.getElementById("content-page").classList.add("d-flex", "justify-content-between");
    displayWelcomeText();
    allEquipment();
  }
}

// function to exec
function newEquipment() {
  //Test Add equiment forms
  //Get all provider
  ajax_request("/all-provider", "POST", new Object({}), response=> {
    let providerOption = [];
    for (let field of response) {
      providerOption.push({
        value: field.id_fournisseur, name: field.nom_fournisseur
      });
    }
    //Build forms
    const AddEquipmentForms = new FormsView("Nouvel Équipement", "Veuillez remplir les champs ci-dessous", "POST", "index.html", [{
      type: "col"
    },
      {
        type: "fieldset",
        name: "Informations Équipements"
      },
      {
        type: "line"
      },
      {
        type: "input",
        name: "Référence",
        typeInput: "text",
        id: "reference-equipement",
        width: 30
      },
      {
        type: "input",
        name: "Désignation",
        typeInput: "text",
        id: "designation-equipement",
        width: 60
      },
      {
        type: "end-line"
      },
      {
        type: "line"
      },
      {
        type: "input",
        name: "Caractéristiques techniques",
        typeInput: "text",
        id: "fiche-technique",
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
        name: "Marque",
        id: "marque-equipement",
        typeInput: "text",
        width: 30
      },
      {
        type: "input",
        name: "Model",
        id: "model-equipment",
        typeInput: "text",
        width: 60
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
        name: "Informations Achats"
      },
      {
        type: "line"
      },
      {
        type: "input",
        typeInput: "number",
        name: "Prix achat",
        id: "prix-achat",
        width: 30
      },
      {
        type: "input",
        typeInput: "date",
        name: "Date achat",
        id: "date-achat",
        width: 30
      },
      {
        type: "select",
        name: "Neuf / Occasion",
        id: "etat-achat",
        options: [{
          name: "Neuf", value: "Neuf"
        }, {
          name: "Occasion", value: "Occasion"
        }],
        width: 30
      },
      {
        type: "end-line"
      },
      {
        type: "end-fieldset"
      },
      {
        type: "fieldset", name: "Fournisseur"
      },
      {
        type: "line"
      },
      {
        type: "select",
        name: "Sélectionnez Fournisseur",
        id: "fournisseur",
        options: providerOption,
        width: 60
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
    //Display Forms
    displayBlocOnBottom(AddEquipmentForms.buildForms()).then(()=> {
      //Control forms to send data with ajax query
      let submitBtn = document.getElementById("forms-submit-btn");
      submitBtn.addEventListener("click", (e)=> {
        e.preventDefault();
        let forms = document.querySelector("form");
        //Check each input of forms
        for (let field of forms.elements) {
          // Filter fields form and get Id input and passwords input
          if (field.type == "text" || field.type == "number" || field.type == "date" || field.type == "select-one") {
            //Check if value of input is enter
            if (field.value == "") {
              //If value of input is not entered, display alert to inform user.
              displayAlert("reveal-error", "Un champs est vide.", 6); break;
            }
          }}
        ajax_request("/register-equipment", "POST", new Object({
          reference_equipement: forms.elements["reference-equipement"].value,
          designation_equipement: forms.elements["designation-equipement"].value,
          marque_equipement: forms.elements["marque-equipement"].value,
          model_equipement: forms.elements["model-equipment"].value,
          fiche_technique: forms.elements["fiche-technique"].value,
          prix_achat: forms.elements["prix-achat"]. value,
          date_achat: forms.elements["date-achat"].value,
          etat_achat: forms.elements["etat-achat"]. value,
          fournisseur: forms.elements["fournisseur"]. value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          allEquipment();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Équipement non ajouté.", 6)
        })
      });
    }, failed=>console.log("Erreur dans la récupération des fournisseurs"));
  })
  allEquipment();
}

//Affected Equipment bloc
//Function affectedEquipment
export function affectedEquipment() {
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
      let newArrayField = []
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
      AffectedEquipmentTable.buildTable().then((table)=> {
        displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
          //Active search for this table.
          AffectedEquipmentTable.search();
          //Get primary key to send query
          AffectedEquipmentTable.getPrimaryKey().then((primaryKey) => {
            //Execute sql query after get primary Key to get information for equipments and provider and affectation
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
                //Declare subInfoView object to display Informations on Equipment selected
                const subInfoView = new SubInfoView(title, description, {
                  id: "close-view", type: "btn", value: "Fermer"
                }, fields)
                return subInfoView.buildSubInfoView();
              }
              displayBlocOnBottom(buildSubInfoView()).then(()=> {
                closeView();
                affectedEquipment();
              });
            }, failed=> {
              console.log("Information non récupéré.")});

          });
        })
      });
    },
    //If sql query fail
    fail=>console.log(fail));


}

//equipment Offline bloc
// Equipment Offline function
export function equipmentOffline() {
  //Exec sql query and return response.
  ajax_request("/all-equipments-offline", "POST", new Object({}), response=> {
    //Get data is format to send on table
    let equipmentOff = (formatDataToArray(response,
      ["ref",
        "designation",
        "marque",
        "model",
        'DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")']));

    let EquipmentOfflineTable = new TableViews(
      "Liste de tout les équipements en panne",
      true,
      ["Référence", "Désignation", "Marque", "Model", "En panne depuis"],
      equipmentOff);
    EquipmentOfflineTable.buildTable().then((table)=> {
      displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
        //Active search for table
        EquipmentOfflineTable.search();
        //Get Primary Key for one line into table. This primary key is used for sql query.
        EquipmentOfflineTable.getPrimaryKey().then((primaryKey)=> {
          //Execute sql query after get primary Key and return response.
          ajax_request("/infos-offline-equipment", "POST", new Object({
            equipRef: primaryKey
          }), sqlResponse=> {
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
                  name: "Informations Pannes"
                },
                {
                  type: "item",
                  name: "En panne depuis le",
                  value: sqlResponse[0]['DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")']
                },
                {
                  type: "item",
                  name: "Description",
                  value: sqlResponse[0].description
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
            displayBlocOnBottom(buildSubInfoView()).then(()=> {
              closeView();
              equipmentOffline();
            });
          }, failed=>console.log(failed));
        });
      });
    });
  }, failed=>console.log("Erreur dan la récupération des équipements Offline"));
}

//Equipment history bloc
function historyEquipment() {
var getFields = new Promise ((resolve, reject)=>{
//Execute sql query
ajax_request("/all-equipments", "POST", new Object({}), response=>{
  //Response from server
  let historyEquipmentResponse = formatDataToArray(response, ["ref", "designation", "marque", "model"]);
    //History of equipment, instance of TableViews class.
  let HistoryEquipmentTable = new TableViews("Tout les équipements enregistrés", true, ["Reference", "Désignation", "Marque", "Model"], historyEquipmentResponse)

  //Build Table and
  HistoryEquipmentTable.buildTable().then((table) => {
    //Display this.
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
      //Active searh bar
      HistoryEquipmentTable.search();
      //Get primary key to exec sql query
      HistoryEquipmentTable.getPrimaryKey().then((primaryKey)=> {
        //Execute sql query after get primary Key and return response.
ajax_request("/infos-equipment", "POST", new Object({equipRef: primaryKey}),
//Get only equipment information ans provider.
infosEquipment=>{
  console.log(infosEquipment[0].designation);
  let sqlResponse = {
          designation: infosEquipment[0].designation,
          marque: infosEquipment[0].marque,
          model: infosEquipment[0].model,
          reference: infosEquipment[0].ref,
          carac_Technique: infosEquipment[0].carac_technique,
          etatAchat: infosEquipment[0].etat_achat,
          dateAchat: infosEquipment[0]['DATE_FORMAT(date_achat, "%d/%m/%Y")'],
          prixAchat: infosEquipment[0].prix_achat,
          etatUtilisation: infosEquipment[0].etat_utilisation,
          fournisseur: infosEquipment[0].nom_fournisseur+", "+infosEquipment[0].adresse_fournisseur,
          }
  //After get equipment informations and provider, get informations on Assign
ajax_request("/user-of-equipment", "POST", new Object({equipRef: primaryKey}),
//Get all user of equipment
userOfEquipment=>{
              //If no user for equipment
  if(userOfEquipment.length==0){
    sqlResponse.utilisation=[{
      utilisateur: "Aucune Utilisation",
            dateDebut: "...",
            dateFin: "..."
    }];
  }else{
  sqlResponse.utilisation=[];
  for(let use of userOfEquipment){
    if(use.date_fin!==null){
        console.log("Non null")
      sqlResponse.utilisation.push({
      utilisateur: use.nom+" "+use.prenom,
      dateDebut: use['DATE_FORMAT(affectation.date_debut, "%d/%m/%Y")'],
      dateFin: use['DATE_FORMAT(affectation.date_fin, "%d/%m/%Y")'],
    })
    }else{
      sqlResponse.utilisation.push({
      utilisateur: use.nom+" "+use.prenom,
      dateDebut: use['DATE_FORMAT(affectation.date_debut, "%d/%m/%Y")'],
      dateFin: "En cours d'utilisation",
    })
    }
  }
  console.log(sqlResponse.utilisation[0]. utilisateur)
  }
  //After get all user of equipment, get all bug of équipement.
  ajax_request("/bug-of-equipment", "POST", new Object({equipRef: primaryKey}),
  //Get all bug.
  bugOfEquipment=>{
    //If no bug for equipment,
    if(bugOfEquipment.length==0){
      console.log("Aucune panne")
      sqlResponse.panne = [{
            datePanne: "Aucune",
            descriptionPanne: "panne",
            dateSolution: "...",
            descriptionSolution: "..."
          }];
      resolve(sqlResponse)    
    }
    //Otherwise, get solution for panne if exit.
    else{
      //For each bug use promise function to get all solution.
   function getSolutionOfBug(bugArray){
     return new Promise((resolve, reject)=>{
        let solutionOfBug=[];
          let i=1;
     bugArray.map((bug)=>{
      console.log(bug.id_pro)
   ajax_request("/solution-of-bug", "POST", new Object({bugId: bug.id_pro}), solution=>{
       if(solution.length==0){
            console.log("Solution is not get");
          }else
          {
            solutionOfBug.push(solution[0]);
          }
       console.log(i)
      if(i==bugArray.length){
   console.log(solutionOfBug)
            resolve(solutionOfBug)
      }
          i++;
        }, failed=>{});
     //   console.log(i)
    });

      })}
      //After get solution for each bug,
      getSolutionOfBug(bugOfEquipment).then((solutions)=>{
      
      
    sqlResponse.panne=[];
      let i=0;
    for(let bug of bugOfEquipment){
       if(solutions.length==0) {
         sqlResponse.panne.push(
            { datePanne: bug['DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")'],
              descriptionPanne: bug.description,
              dateSolution: "Solution",
              descriptionSolution: "Non disponible"
            })
       //    resolve(sqlResponse)
       }else{
   //    for(let solve of solutions){
       //   console.log(solve.description)
       console.log(i+", " +bug.description +", " +solutions[i].description)
          if(bug.id_pro==solutions[i].id_pro){
            sqlResponse.panne.push(
            { datePanne: bug['DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")'],
              descriptionPanne: bug.description,
              dateSolution: solutions[i]['DATE_FORMAT(solution.date_remise, "%d/%m/%Y")'],
              descriptionSolution: solutions[i].description
            })
          }else {
            sqlResponse.panne.push(
            { datePanne: bug['DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")'],
              descriptionPanne: bug.description,
              dateSolution: "Solution",
              descriptionSolution: "Non trouvé"
            })
          }
     //   }
     
         //   resolve(sqlResponse)    
      }
      i++;
    }
      
    /*    displayBlocOnBottom(buildSubInfoView()).then(()=> {
          closeView();
          historyEquipment();
        });*/
        
     resolve(sqlResponse)
      })
    }
  //  setTimeout(function() {
      
        
  //  }, 3000);
        
  },
 //If query to get bug of Equipment failed
failed=>console.log(failed)
  );
},
//If query to get user of equipment failed 
failed=>console.log(failed));
}, 
//If query to get informations of equipment failed
failed=>console.log(failed));
      });
    });
  });
}, failed=>console.log(failed));
  });
  getFields.then((sqlResponse)=>{
    function buildSubInfoView() {
          //Format title using value
          let title = sqlResponse.designation +" " +  sqlResponse.marque + " "+ sqlResponse.model;
          //Format description using value
          let description = sqlResponse.reference + ", " + sqlResponse.etatUtilisation;
          //Format fields array
console.log(sqlResponse.panne)
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
              value: sqlResponse.carac_Technique
            },
            {
              type: "item",
              name: "Etat achat",
              value: sqlResponse.etatAchat
            },
            {
              type: "item",
              name: "Prix achat",
              value: sqlResponse.prixAchat
            },
            {
              type: "item",
              name: "Date Achat",
              value: sqlResponse.dateAchat
            },
            {
              type: "item",
              name: "Fournisseur",
              value: sqlResponse.fournisseur
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
              name: "Utilisation"
            }];
          //read Utilisateur and format
          for (let el of sqlResponse.utilisation) {
            fields.push({
              type: "item", name: el.utilisateur+"<br>", value: "Du " + el.dateDebut + " Au " + el.dateFin
            });
          }
          fields.push({
            type: "end-fieldset"
          });
          fields.push({
            type: "end-col"
          });
          fields.push({
            type: "col"
          });
          fields.push({
            type: "fieldset", name: "Pannes"
          });
          //read Pannes and Format
          for (var el of sqlResponse.panne) {
            let item = {
              type: "item"
            };
            item.name = el.datePanne + ", " + el.descriptionPanne +"<br> ";
            item.value = "=> "+ el.dateSolution + ", " + el.descriptionSolution;
            fields.push(item)}
          fields.push({
            type: "end-fieldset"
          });
          fields.push({
            type: "end-col"
          });
          //Declare subInfoView object to display Informations on Equipment selected
          const subInfoView = new SubInfoView(title, description, {
            id: "close-view", type: "btn", value: "Fermer"
          }, fields);
          return subInfoView.buildSubInfoView();
        }
        displayBlocOnBottom(buildSubInfoView()).then(()=> {
          closeView();
          historyEquipment();
        });  
  })

}

//Function to remove Equipment
function removeEquipment() {
    //Exec sql query and return response.
  ajax_request("/all-equipments-offline", "POST", new Object({}), response=> {
    //Get data is format to send on table
    let equipmentOff = (formatDataToArray(response,
      ["ref",
        "designation",
        "marque",
        "model",
        'DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")']));

    let EquipmentOfflineTable = new TableViews(
      "Liste de tout les équipements en panne",
      true,
      ["Référence", "Désignation", "Marque", "Model", "En panne depuis"],
      equipmentOff); 
  EquipmentOfflineTable.buildTable().then((table)=> {
    displayBlocOnTop(table).then(()=> {
      //Active search for table
      EquipmentOfflineTable.search();
      //Get Primary Key for one line into table. This primary key is used for sql query.
      EquipmentOfflineTable.getPrimaryKey().then((primaryKey)=> {
        //Execute sql query after get primary Key and return response.
ajax_request("/infos-offline-equipment", "POST", new Object({
            equipRef: primaryKey
          }), sqlResponse=> {
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
                  name: "Informations Pannes"
                },
                {
                  type: "item",
                  name: "En panne depuis le",
                  value: sqlResponse[0]['DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")']
                },
                {
                  type: "item",
                  name: "Description",
                  value: sqlResponse[0].description
                },
                {
                  type: "end-fieldset"
                },
                {
                  type: "end-col"
                }];
              //Declare subInfoView object to display Informations on Equipment selected
              const subInfoView = new SubInfoView(title, description, {
                  id: "remove-Equipment", type: "btn", value: "Retirer"
          }, fields)
              return subInfoView.buildSubInfoView();
            }
            displayBlocOnBottom(buildSubInfoView()).then(()=>//              request to remove equipment on parc
{
          function removeEquip() {
            document.getElementById("remove-Equipment").addEventListener("click", ()=> {
              ajax_request("/remove-equipment", "POST", new Object({equipRef: primaryKey}), response=>{
                displayAlert("reveal-error", response.status, 10);
                removeEquipment();
              }, failed=>{
                displayAlert("reveal-error", "Erreur de retrait.", 10);
              })
            });
          }
          removeEquip();
          removeEquipment();
        });
        //    });
          }, failed=>console.log(failed));
      });
    });
  });
  })
}

//All provider.
//All provider function
function allProvider() {
  //Sql query  to exec
ajax_request("/all-provider", "POST", new Object({}), response=>{
  let allProviderResponse = formatDataToArray(response, ["id_fournisseur", "nom_fournisseur", "adresse_fournisseur"]);
  //Table of All Provider
let AllProviderTable = new TableViews("Liste de tout les fournisseurs", true, ["ID", "Nom", "Adresse"], allProviderResponse)
  AllProviderTable.buildTable().then((table)=> {
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
      //Active search for this table.
      AllProviderTable.search();
      //Get primary key to next
      AllProviderTable.getPrimaryKey().then((primaryKey)=> {
        //Use primary key to exec sql query
ajax_request("/equipments-of-provider", "POST", new Object({idProvider: primaryKey}), response=>{
  if(response.length!=0){
  let sqlResponse = {
    idProvider: response[0].id_fournisseur,
    nameProvider: response[0].nom_fournisseur,
    equipmentsOfProvider: formatDataToArray(response, ["ref", "designation", "marque", "model"])
  };
              //Build sub info view
        function buildSubInfoView() {
          //Build table contain all equupment of this provider has bug.
          let EquipmentOfThisProviderTable = new TableViews("Tout les equipements de "+sqlResponse.nameProvider, true, ["Référence", "Désignation", "Marque", "Model"], sqlResponse.equipmentsOfProvider);
          //Table building
          EquipmentOfThisProviderTable.buildTable().then((table)=> {
            displayBlocOnBottom('<div class="table-bloc">' + table +'</div>');
          })
        }
        buildSubInfoView();
  }
  else{
    displayBlocOnBottom("Aucun équipement enregistré pour cet fournisseur.")
  }
  allProvider();
}, failed=>{console.log(failed)});
      })
    });
  })
}, failed=>{console.log(failed)})
}

//Add a new provider
function addProvider() {
  let AddProviderForms = new FormsView("Nouvel Fournisseur", "Renseignez les champs ci-dessous pour ajouter un fournisseur.", "POST", "index.html", [{
    type: "col"
  },
    {
      type: "fieldset", name: "Informations Fournisseurs"
    },
    {
      type: "line"
    },
    {
      type: "input",
      name: "Nom",
      id: "nom-fournisseur",
      typeInput: "text",
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
      id: "adresse-fournisseur",
      typeInput: "text",
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
    }])
  allProvider();
  displayBlocOnBottom(AddProviderForms.buildForms()).then(()=>{
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
        ajax_request("/register-provider", "POST", new Object({
          nom_fournisseur: forms.elements["nom-fournisseur"].value,
          adresse_fournisseur: forms.elements["adresse-fournisseur"].value
        }), success=> {
          displayAlert("reveal", success.status, 6)
          allProvider();
          forms.reset();
        }, failed=> {
          displayAlert("reveal-error", "Erreur! Fournisseur non ajouté.", 6)
        })
          }
  });
})
}

//All provider bug bloc
function allProviderBug() {
  //Sql query to get all provider has bug
ajax_request("/all-equipments-offline-by-fournisseur", "POST", new Object({}), response=>{
  let allProviderBugResponse = formatDataToArray(response, ["id_fournisseur", "nom_fournisseur", "hasBug"]);
  let AllProviderBugTable = new TableViews("Fournisseurs ayant les équipements defaillants", true, ["ID", "Nom", "Nbre d'équipements defaillants"], allProviderBugResponse)
  AllProviderBugTable.buildTable().then((table)=> {
    displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
      AllProviderBugTable.search();
      AllProviderBugTable.getPrimaryKey().then((primaryKey)=> {
        // Sql query return this response
ajax_request("/bug-equipments-of-provider", "POST", new Object({idProvider: primaryKey}), res=>{
  let sqlResponse = {
          idProvider: primaryKey,
          bugEquipmentsOfProvider: formatDataToArray(res, ["ref", "designation", "marque", "model", "description"])
        };
        //Get name pf provider
        for(let prov of response){
          if (prov.id_fournisseur==primaryKey){
            sqlResponse.nameProvider = prov.nom_fournisseur;
          }
        }
  //Build sub info view
function buildSubInfoView() {
          //Build table contain all equupment of this provider.
          let BugEquipmentOfThisProviderTable = new TableViews("Tout les equipements defaillants de "+sqlResponse.nameProvider, true, ["Référence", "Désignation", "Marque", "Model", "Pannes"], sqlResponse.bugEquipmentsOfProvider);
          //Table building
          BugEquipmentOfThisProviderTable.buildTable().then((table)=> {
            displayBlocOnBottom(table);
            allProviderBug();
          })
        }
        buildSubInfoView();
}, failed=>{displayAlert("reveal-error", "Erreur de requête. Réessayer.", 6)});
      })
    })
  })
}, failed=>{displayAlert("reveal-error", "Erreur de requête. Réessayer.", 6)})



}


//All Equipment bloc
function allEquipment() {
  //Execute sql query
  ajax_request("/all-equipments", "POST", new Object({}), response=> {
    let allEquipmentResponse = formatDataToArray(response, ["ref", "designation", "marque", "model"])
    //Response from server
    //All equipment, instance of TableViews class.
    let AllEquipmentTable = new TableViews("Tout les équipements enregistrés", true, ["Reference", "Désignation", "Marque", "Model"], allEquipmentResponse)
    //Build Table and
    AllEquipmentTable.buildTable().then((table) => {
      //Display this.
      displayBlocOnTop('<div class="table-bloc">' + table +'</div>').then(()=> {
        //Active searh bar
        AllEquipmentTable.search();
        //Get primary key to exec sql query
        AllEquipmentTable.getPrimaryKey().then((primaryKey)=> {
          //Execute sql query after get primary Key and return response.
          console.log(primaryKey)
          ajax_request("/infos-equipment", "POST", new Object({
            equipRef: primaryKey
          }), sqlResponse=> {
      //      console.table(sqlResponse)
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
                  value: sqlResponse[0].prix_achat + "FCFA"
                },
                {
                  type: "item",
                  name: "Date Achat",
                  value: sqlResponse[0]['DATE_FORMAT(date_achat, "%d/%m/%Y")']
                },
                {
                  type: "item",
                  name: "Fournisseur",
                  value: sqlResponse[0].nom_fournisseur+",  "+sqlResponse[0].adresse_fournisseur
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
              }, fields);
              return subInfoView.buildSubInfoView();
            }

            displayBlocOnBottom(buildSubInfoView()).then(()=> {
              closeView();
              allEquipment();
            });
          }, failed=>console.log("Erreur dans la réception des infos sur l'equipement."))
        });
      });
    });

  })
}