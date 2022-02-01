export default class TableViews {

  constructor(title, viewNumberOfLine, header = [], fields = []) {
    this.title = title;
    this.viewNumberOfLine = viewNumberOfLine;
    this.header = header;
    this.fields = fields;
  }

  //This function build any table
 buildTable() {
   let viewNumberOfLine = this.viewNumberOfLine;
   let title = this.title;
   let header = this.header;
   let fields = this.fields
   return new Promise(function(resolve, reject) {
    let tableView = '<table class="equipment-table">';
    // Begin Table Title and Head
    tableView += '<thead>';
    tableView += '<tr id="table-head">';
    if (viewNumberOfLine)
      tableView += '<th colspan="' + header.length + ':"><div>' + title + ': <span class="number-of-line">' + fields.length + '</span></div><input type="text" id="search-forms-tabs" placeholder="Rechercher"></th></tr>';
    else
      tableView += '<th colspan="' + header.length + ':">' + title + '</span></div><input type="text" id="search-forms-tabs" placeholder="Rechercher"></th></tr>';
    tableView += '<tr>'; // Field of table header
    for (var field of header)
      tableView += '<th style="width: ' + (100 / header.length) + '%;">' + field + '</th>';
    tableView += '</tr>';
    tableView += '</thead>';
    // End Table Title and Head
    // Begin table body
    tableView += '<tbody>';
    for (var line of fields) {
      tableView += '<tr class="line-table">';
      for (var column of line)
        tableView += '<td style="width: ' + (100 / header.length) + '%;">' + column + '</td>';
      tableView += '</tr>';
    } // End table body
    tableView += '</tbody></table>';
    resolve(tableView);
  });

 } 
 
 //hiss function get primary key.
 getPrimaryKey(){
   return new Promise((resolve, reject) => {
        var tbody = document.querySelector("tbody");
        tbody.addEventListener("click",
          (e) => {
            //get primary key into table
            let primaryKey = e.target.closest("tr").cells[0].innerHTML;
            resolve(primaryKey);
            reject("erreur");
          });
 })}
 
  // This is search function. This function filter the value in table.
  search(valueToSearch,
    idInput,
    searchInArray) {
    idInput = "search-forms-tabs"; /* Get id for input forms */
    searchInArray = this.fields; /* Get array where element will search*/
    let search_bloc = document.getElementById(idInput); //Get input on DOM with id.
    search_bloc.addEventListener("keyup", () => {
      //If one key is press in input,
      if (search_bloc.value /*If a value is enter in input*/ || event.keyCode == 8/* or backspace key is enter*/) {
        valueToSearch = new RegExp(search_bloc.value, "i"); //Get and Convert input value in regex character
        let lineTrue = "",
        /*This variable is use to build html code who is view on tbody*/ isGet = false; /* This variable is used to control if search return value or no. */
        searchInArray.map((line) => {
          /* Get each line of the array*/
          for (var column of line) /* Get each column of line */ {
            if (valueToSearch.test(column)) {
              /* Use RegEx function to test if value is enter in input is on column */
              lineTrue += '<tr class="line-table">'; // if value is on column, build html row code,
              line.map((field) => {
                lineTrue += '<td style="width: ' + (100 / this.header.length) + '%;">' + field + '</td>';
              }) // use td to build html code for columns
              lineTrue += '</tr>'; /*End html result building*/ document.querySelector("tbody").innerHTML = lineTrue; /* Display result on table. */ isGet = true; /* If search return value, isGet take true */ return 0; /* Block doublon */
            }
          }
        })
        if (!isGet) {
          //If no value is return,
          // build html code to display message.
          lineTrue += '<tr class="d-flex justify-content-center"><td colspan = "' + this.header + '"> Oups... Pas de résultat correspondant </td></tr>';
          document.querySelector("tbody").innerHTML = lineTrue; //Display the message.
        }
      }
    });
  }
}

// This function is exec, if one line of table is click. It return primary key