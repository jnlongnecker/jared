let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>footer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  justify-items: stretch;
  background-color: rgba(255,255,255,.06);
  border-top: 2px solid rgba(255,255,255, 0.08);
  padding: 1rem 0 0 0;
}


section {
  margin: 0;
  justify-content: space-evenly;
  font-size: .8rem;
  padding: 5px 10px;
  color: rgba(255,255,255, 0.65);
  width: 30%;
}

hr {
  width: 2px;
  background-color: rgba(255,255,255, 0.5);
  border: 0;
}

section hr {
  height: 2px;
  width: 100%;
  background-color: rgba(255,255,255, 0.8);
  border: 0;
  margin: 0;
}

h1,h2,h3,h4,h5,h6 {
  color: rgba(255,255,255, 0.8);
}

p {
  margin: 5px 0;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 1rem;

}

.left {
  align-items: flex-start;
}

.middle {
  text-align: center;
  align-items: stretch;
}

.right {
  align-items: flex-end;
}


@media only screen and (max-width: 900px) {
  footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .left,.middle,.right {
    align-items: flex-end;
    text-align: right;
  }

  .middle {
    order: -1;
  }

  .middle+hr {
    order: -1;
  }

  hr {
    width: 50%;
    height: 1px;
    margin: .5rem 10px .5rem 0;
  }
}
</style>
<footer>
    <section class="left">
        <div>
            <h6>Pages</h6>
            <hr />
        </div>

        <p><a href="/circles">Circles</a></p>
        <p><a href="/quadTree">QuadTree</a></p>
        <p><a href="/wfc">Wave Function Collapse</a></p>
    </section>
    <hr />
    <section class="middle">
        <div class="icons">
            <a href="https://github.com/jnlongnecker">
                <svg fill="#ffffff" stroke="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"
                    width="1.5rem" height="1.5rem">
                    <title>GitHub</title>
                    <path
                        d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
                </svg>
            </a>
            <a href="https://www.linkedin.com/in/jared-longnecker/">
                <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="1.5rem"
                    height="1.5rem">
                    <path
                        d="M25,2C12.318,2,2,12.317,2,25s10.318,23,23,23s23-10.317,23-23S37.682,2,25,2z M18,35h-4V20h4V35z M16,17 c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2C18,16.105,17.105,17,16,17z M37,35h-4v-5v-2.5c0-1.925-1.575-3.5-3.5-3.5 S26,25.575,26,27.5V35h-4V20h4v1.816C27.168,20.694,28.752,20,30.5,20c3.59,0,6.5,2.91,6.5,6.5V35z" />
                </svg>
            </a>
        </div>
        <p>Site maintained by Jared Longnecker</p>
        <p>Last updated July 2022</p>
    </section>
    <hr />
    <section class="right">
        <div>
            <h6>Sources</h6>
            <hr />
        </div>
        <p>Icons by <a target="_blank" href="https://icons8.com/">Icons8</a></p>
        <p>Site <a target="_blank" href="https://github.com/jnlongnecker/jared">source code</a></p>
    </section>
</footer>`;

export default class JworkFooter extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-footer', JworkFooter);