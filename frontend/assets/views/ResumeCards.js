import {
  ajax_request
} from "./basic_function.js";
import {
  execJSCode
} from "./basic_function.js";
import {
  formatDataToArray
} from "./basic_function.js";
import TableViews from "./TableViews.js";

export var cards = [{
  id: "all-equipment",
  icone: "plug",
  iconBgColor: "#5D89FE",
  number: 0,
  item: "Equipments",
  isActive: true,
  response: [],
  exec_card_function: all_equipment
},

  {
    id: "equipment-running",
    icone: "switch-on",
    iconBgColor: "#668F3F",
    response: [],
    number: 0,
    item: "En service",
    isActive: false,
    query: "",
    exec_card_function: equipment_running
  },

  {
    id: "equipment-offline",
    icone: "repair-tool",
    iconBgColor: "#A6CDFF",
    number: 0,
    item: "En maintenance",
    isActive: false,
    query: "",
    response: [],
    exec_card_function: equipment_offline
  },

  {
    id: "all-user",
    icone: "user-avatar",
    iconBgColor: "#5AB490",
    number: 0,
    item: "Utilisateurs",
    isActive: false,
    query: "",
    response: [],
    exec_card_function: all_user
  }];

//All equipment Card
//Get all Equipments with sql query.
export let getAllEquipments = new Promise ((resolve, reject)=> {
  ajax_request("/all-equipments", "POST", new Object({}), response=> {
    resolve(formatDataToArray(response, ["ref", "designation", "marque", "model", "etat_utilisation", "nom_fournisseur"]));
  }, fail=>console.log(fail));
});
//Equipment table
let AllEquipmentTable;
getAllEquipments.then((field)=> {
  AllEquipmentTable = new TableViews(
    "Liste de tout les équipements",
    true,
    ["Référence", "Désignation", "Marque", "Model", "Etat utilisation", "Fournisseur"], field
  );
});
function all_equipment() {
 return AllEquipmentTable.buildTable();
}


//Equipment running card
//Get all Equipments affected and user with sql query.
export let getAllEquipmentsAffected = new Promise ((resolve, reject)=> {
  ajax_request("/all-equipments-affected", "POST", new Object({}), response=> {
    //Get data is format to send on table.
    resolve(formatDataToArray(response, ["designation", "marque", "model", "nom", "prenom", 'DATE_FORMAT(affectation.date_debut, "%d/%m/%Y")']));
  }, fail=>console.log(fail));
});
let EquipmentRunningTable;
let newArrayField = [];
getAllEquipmentsAffected.then((field)=> {
  field.map((el)=> {
    //Reformat array contain data for join user first-name and last-name
    let line = [];
    line.push(el[0]);
    line.push(el[1]);
    line.push(el[2]);
    line.push(el[3]+" "+el[4]);
    line.push(el[5]);
    newArrayField.push(line);
  })
  //Table object
  EquipmentRunningTable = new TableViews(
    "Equipements en service & utilisateurs",
    true,
    ["Designation", "Marque", "Model", "Utilisateur", "Depuis"],
    newArrayField
  );
})
//Function to return table code to display.
async function equipment_running() {
  return await EquipmentRunningTable.buildTable();
}

//Equipment offline card
//Get data on database with sql query
export let getAllEquipmentsOffline = new Promise ((resolve, reject)=> {
  ajax_request("/all-equipments-offline", "POST", new Object({}), response=> {
    //Get data is format to send on table.
    resolve(formatDataToArray(response, ["designation", "marque", "model", "description", 'DATE_FORMAT(probleme.date_panne, "%d/%m/%Y")']));
  }, fail=>console.log(fail));
});
let EquipmentOfflineTable;

getAllEquipmentsOffline.then((field)=> {
  EquipmentOfflineTable = new TableViews(
    "Liste de tout les équipements en panne",
    true,
    ["Désignation", "Marque", "Model", "Panne", "Depuis"],
    field);
});

async function equipment_offline() {
  return await EquipmentOfflineTable.buildTable();
}

//All User cards
export let getAllUser = new Promise ((resolve, reject)=> {
  ajax_request("/all-user", "POST", new Object({}), response=> {
    //Get data is format to send on table.
    resolve(formatDataToArray(response, ["id_utilisateur", "nom", "prenom"]));
  }, fail=>console.log(fail));
});
let AllUserTable;
getAllUser.then((field)=> {
  AllUserTable = new TableViews(
    "Tout les utilisateurs",
    true,
    ["N°", "Nom", "Prenom"],
    field);
});
async function all_user() {
  return await AllUserTable.buildTable();
}

export function cardIsActive(card, cardElement) {
  if (card.isActive) {
    //Apply CSS active card.
    cardElement.classList.add("info-card-active");
    //Execute function for this card.
    //Use promise to wait the table is build before display this.
    card.exec_card_function().then(function(res) {
      document.querySelector(".table-bloc").innerHTML = res;
      //Execute search function for table views for each card.
      switch (card.id) {
        case 'all-equipment':
          AllEquipmentTable.search();
          break;
        case 'equipment-running':
          EquipmentRunningTable.search();
          break;
        case 'equipment-offline':
          EquipmentOfflineTable.search();
          break;
        case 'all-user':
          AllUserTable.search();
          break;
      }
    }).catch(function(error) {
      console.log("Fonction non defini" + error);
    });
  } else {
    /* cardElement.classList.remove("info-card-active");*/
  }
}