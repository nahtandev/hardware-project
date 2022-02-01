export default  class SubInfoView {
  constructor(title, description, actionBtn, fields) {
    this.title = title;
    this.description = description;
    this.actionBtn = actionBtn;
    this.fields = fields;
  }

  buildSubInfoView() {
    let subInfo = '<div id="sub-info">';
    //Header of bloc and btn
    subInfo += '<div class="width-100p d-flex justify-content-between align-items-center">';
    subInfo += '<div class="sub-info-header">'
    //Sub Info View title
    subInfo += '<div class="sub-info-title">'+ this.title +'</div>';
    //Sub info description
    subInfo += '<div class="sub-info-description">'+ this.description +'</div></div>';
    //Sub info button
    subInfo += '<button id="' +this.actionBtn.id +'"type="' + this.actionBtn.type + '"> ' + this.actionBtn.value + '</button></div>';

    subInfo += this.getCodeBody();
    subInfo += '</div>';
    return subInfo;
  }
  
  

  getCodeBody() {
    let bodyBloc = '<div id="body-bloc">';
    for (let field of this.fields) {
      if (field.type == "col") {
        let cod_Col = '<div class="col">';
        //Get all fields after current col.
        let colArray = this.getFieldFilter(this.fields, field, "end-col")
        for (let fieldset of colArray) {
          if (fieldset.type == "fieldset") {
            let code_Fieldset = '<div class="fieldset">' + '<span  class="fieldset-name">'+fieldset.name+'</span>';
            //Get all fields after curent fieldset.
            let fieldsetArray = this.getFieldFilter(colArray, fieldset, "end-fieldset")
            for (let line of fieldsetArray) {
              let code_Line = '<div class="item">';
                  if (line.type === "item"){
                    let codeItem = '<span class="item-name">' + line.name + ':   </span> <span class="item-value">' + line.value + '</span>'; 
                    code_Line += codeItem;
                  }
                  code_Line += '</div>';
                  code_Fieldset += code_Line;
                }
                code_Fieldset += '</div>';
                cod_Col += code_Fieldset;
              }
            }
            cod_Col += '</div>';
            bodyBloc += cod_Col;
          }
        }
    bodyBloc += '</div>';
    return bodyBloc;
  }
  
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