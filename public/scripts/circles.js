import JworkHeader from "../components/jwork-header.js";
import JworkFooter from "../components/jwork-footer.js";

import JworkCircles from "../components/jwork-circles.js";

const main = document.createElement("jwork-circles", { is: JworkCircles });

const head = document.createElement("jwork-header", { is: JworkHeader });
const foot = document.createElement("jwork-footer", { is: JworkFooter });

document.querySelector("#main").appendChild(head);
document.querySelector("#main").appendChild(main);
document.body.appendChild(foot);