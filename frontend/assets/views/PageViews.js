import getCodeSVG from "../js/svg.js"; //Import svg file

// PageViews Class
export default class PageViews {
    constructor() {
        this.title = "";
        this.description = "";
        this.options = [];
        this.contentHTML = "";
    }
    // Set page header (Title & Description)
    getTitle(){
        return this.title;
    }
    getDescription(){
        return this.description;
    }
    // Build the options of page
    buildOptionsView() {
        let optionViews = "";
        for (let option of this.options) {
            optionViews += '<div class="page-option" id="' + option.id + '"><div>' + getCodeSVG(option.iconeSvgId) + '</div><div>' + option.name + '</div></div>';
        }
        return optionViews;
    }

    // if a option is click, the function ix exec
    exec_Function() {
        //Use .map method to execute each function in each option, if this option is click
        const potentialOptions = this.options.map(option => {
            // Listen clic on option
            document.getElementById(option.id).addEventListener('click', () => {
              if(option.toExec.positio==null){
                try {
                    option.toExec. function() // If this option is clic, this is execute
                } catch (error) {
                    console.log("Erreur: Fonction non défini"+error) //otherwise, error message is send console.
                }}
            })
        })
    }

    // This function get content. The content is build in each Page.
    getContentHTML(){
      //Pour l'instant, nous ferons des tests en affichant le contenu de chaque page via le document.getElementById.
      
      return new Promise((resolve, reject)=>{
        resolve(this.contentHTML());
      });
    }
}

