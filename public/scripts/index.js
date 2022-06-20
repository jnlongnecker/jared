import JworkHeader from "../components/jwork-header.js";
import JworkFooter from "../components/jwork-footer.js";

import JworkMain from "../components/jwork-main.js";

const main = document.createElement("jwork-main", { is: JworkMain });

const head = document.createElement("jwork-header", { is: JworkHeader });
const foot = document.createElement("jwork-footer", { is: JworkFooter });

document.querySelector("#main").appendChild(head);
document.querySelector("#main").appendChild(main);
document.body.appendChild(foot);