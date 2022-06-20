import JworkHeader from "../components/jwork-header.js";
import JworkFooter from "../components/jwork-footer.js";

import JworkPhysics from "../components/jwork-physics.js";

const main = document.createElement("jwork-physics", { is: JworkPhysics });

const head = document.createElement("jwork-header", { is: JworkHeader });
const foot = document.createElement("jwork-footer", { is: JworkFooter });

document.querySelector("#main").appendChild(head);
document.querySelector("#main").appendChild(main);
document.body.appendChild(foot);