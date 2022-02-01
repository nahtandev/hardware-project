export default class FormsView {
  constructor(name, description, method, action, fields) {
    this.name = name;
    this.description = description;
    this.method = method;
    this.action = action;
    this.fields = fields;
  }

  //This function build the forms and return html code after proccess.
  buildForms() {
    let forms = '<form ';
    forms += 'action = "' + this.action + '" ' + 'method = "' + this.method + '">';
    //Header of forms and submit btn
    forms += '<div class="width-100p d-flex justify-content-between align-items-center">';
    forms += '<div class="forms-header">'
    //Forms title
    forms += '<div class="forms-title">'+ this.name +'</div>';
    //Forms description
    forms += '<div class="forms-description">'+ this.description +'</div></div>';
    //Forms submit button
    forms += '<button id="forms-submit-btn" type="submit">Valider</button></div>';
    //This function read array contains fields and build html code.
    forms += this.getCodeBodyForms();
    forms += '</form>';
    console.log(forms);
    return forms;
  }

  getCodeBodyForms() {
    let bodyForms = '<div id="body-forms">';
    for (let field of this.fields) {
      if (field.type == "col") {
        let cod_Col = '<div class="col">';
        //Get all fields after current col.
        let colArray = this.getFieldFilter(this.fields, field, "end-col")
        for (let fieldset of colArray) {
          if (fieldset.type == "fieldset") {
            let code_Fieldset = '<div class="fieldset">' + '<span class="fieldset-name">'+fieldset.name+'</span>';
            //Get all fields after curent fieldset.
            let fieldsetArray = this.getFieldFilter(colArray, fieldset, "end-fieldset")
            for (let line of fieldsetArray) {
              if (line.type == "line") {
                let code_Line = '<div class="line">';
                //Get all fields after curent line.
                let lineArray = this.getFieldFilter(fieldsetArray, line, "end-line")
                for (let endField of lineArray) {
                  if (endField.type === "input" || endField.type === "select" || endField.type === "btn") {
                    if (endField.type == "input") {
                      let codeInput = '<input required type="' + endField.typeInput + '" name="' + endField.id + '" placeholder="' + endField.name + '" style="width: ' + endField.width + '%;">';
                      code_Line += codeInput;
                    }

                    if (endField.type == "select") {
                      let codeSelect = '<select name="' + endField.id + '" style="width: ' + endField.width + '%;"><option selected  disabled value="">' + endField.name + '</option>';
                      for (let option of endField.options) {
                        codeSelect += '<option value = "' + option.value + '">' + option.name + '</option>';
                      }
                      codeSelect += '</select>';
                      code_Line += codeSelect;
                    }

                    if (endField.type == "btn") {
                      let codeBtn = '<span id="' + endField.id +'">' +  getCodeSVG(endField.svgId) + '</span>';
                      code_Line += codeBtn;
                    }
                  }
                }
                code_Line += '</div>';
                code_Fieldset += code_Line;
              }
            }

            code_Fieldset += '</div>';
            cod_Col += code_Fieldset;
          }
        }
        cod_Col += '</div>';
        bodyForms += cod_Col;
      }
    }
    bodyForms += '</div>';
    return bodyForms;
  }
  //This function get only the necessary fields
  getFieldFilter(arrayToFilter, startPoint, endPoint) {
    //remove field before start point end start point
    let arrayIsFilter = arrayToFilter.map((el)=> {
      if (arrayToFilter.indexOf(el) > arrayToFilter.indexOf(startPoint)) return el;
    }).filter((isDefine)=> {
      return isDefine != undefined
    });
    // remove field after end point and end point.
    arrayIsFilter = arrayIsFilter.map((el)=> {
      if (arrayIsFilter.indexOf(el) < arrayIsFilter.findIndex(i => i.type == endPoint)) return el;
    }).filter((isDefine)=> {
      return isDefine != undefined
    });
    return arrayIsFilter;
  }
}