import {
  navigateTo
} from "../js/script.js";
import loadEffect from "./basic_function.js";
import {
  checkUser
} from "./basic_function.js";
export class StartViews {
  constructor(title, contentHTML) {
    this.title = "HardWare";
    this.contentHTML = '<div class="d-flex flex-column align-items-center justify-content-center" style="height: 100%;"><div class="d-flex justify-content-between  logo-start-screen"><div>hard</div><div>ware</div></div><div class="copyright"></div></div>';
  }
  getContentHTML() {
    return new Promise((resolve, reject)=> {
      resolve(this.contentHTML)});
  }

  execCode() {
    checkUser();
    
  }
}