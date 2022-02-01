import PageViews from "./PageViews.js";
//rtport TableViews from "./TableViews.js";
import getCodeSVG from "../js/svg.js";
import {
  cards
} from "./ResumeCards.js";
import {
  cardIsActive
} from "./ResumeCards.js";
import {
  getAllEquipmentsOffline
} from "./ResumeCards.js";
import {
  getAllEquipments
} from "./ResumeCards.js";
import {
  getAllUser
} from "./ResumeCards.js";
import {
  getAllEquipmentsAffected
} from "./ResumeCards.js";
import {
  navigateTo
} from "../js/script.js";
export class DashboardView extends PageViews {
  constructor() {
    super();
    this.title = "Tableau de Bord",
    this.description = "Ici,vous avez un aperçu de tout ce qui se passe."
    this.options = [{
      iconeSvgId: "plug-add",
      name: "Nouvel Equipment",
      id: "new-equipment",
      toExec: {
        position: null,
        function: newEquipment
      }
    },
      {
        iconeSvgId: "service",
        name: "Ajouter service",
        id: "add-service",
        toExec: {
          position: null,
          function: addService
        }
      },
      {
        iconeSvgId: "add-user",
        name: "Nouvel utilisateur",
        id: "new-user",
        toExec: {
          position: null,
          function: newUser
        }
      },
      {
        iconeSvgId: "bug",
        name: "Enregistrer Panne",
        id: "register-bug",
        toExec: {
          position: null,
          function: registerBug
        }
      },
    ];

    // Return the html code for this page
    this.contentHTML = (html = "") => {
      //Resume Card View html
      html += '<div class="resume-card d-flex justify-content-between" id="resume-card">'+buildResumeCard()+'</div>';
      html += '<div class="d-flex justify-content-between" style="height: 342px;">'

      html += '<div class="table-bloc"> </div>';

      html += '<div class="page-option-bloc d-flex align-items-center flex-column">';

      html += this.buildOptionsView()
      html += '</div></div>';

      console.log(html)
      return html;
    }
  }

  execCode() {
    document.getElementById("content-page").classList.add("d-flex", "flex-column");
    document.getElementById("content-page").classList.remove("justify-content-between");
    //Control each card.
    cards.map((card) => {
      //Execute query of this card and charged result in card.response
      let cardElement = document.getElementById(card.id);
      //Listen click on a card.
      cardElement.addEventListener("click", () => {
        //If a card is click, remove CSS Active-Class from other card.
        for (var currentCard of document.querySelectorAll(".info-card")) {
          if (currentCard.id != card.id)
            currentCard.classList.remove("info-card-active");
        }
        //Active card
        card.isActive = true;
        cardIsActive(card, cardElement);
      });

      //After initialise page, thise function check arrays card to execute.
      cardIsActive(card,
        cardElement);
    })
    //Get number of all Equipment
    getAllEquipments.then((field)=> {
      //Display Number
      document.getElementById("all-equipment-number").innerHTML = field.length;
    });
    //Get number of all Equipment affected
getAllEquipmentsAffected.then((field)=>{
    //Display number of items in card
  document.getElementById("equipment-running-number").innerHTML = field.length;
});

//Get number of offline Equipment
getAllEquipmentsOffline.then((field)=>{
  document.getElementById("equipment-offline-number").innerHTML = field.length;
});

//Get number of all user
getAllUser.then((field)=>{
  document.getElementById("all-user-number").innerHTML = field.length;
});
  }
}

// Function to execute for each option
function newEquipment() {
  //New Equipment
  navigateTo("/app/equipment");

}

function newUser() {
  //New Option
  navigateTo("/app/users");

}

function addService() {
  //Add Service
  navigateTo("/app/service");
}

function registerBug() {
  navigateTo("/app/bug");
}

//This function build view for all resume cards.
function buildResumeCard() {
  let cardsView = "";
  cards.map((card) => {
    cardsView += '<div id="' + card.id + '" class="info-card';
    if (card.isActive) cardsView += ' info-card-active'
    cardsView += '"><div style="background-color:' + card.iconBgColor + ';">' + getCodeSVG(card.icone) + '</div> <div> <div id="'+card.id+'-number">' +card.number+ '</div><div>' + card.item + '</div></div></div>';

  })
  return (cardsView);
}