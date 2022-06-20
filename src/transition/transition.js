export default class Transition extends HTMLElement {

    static currTransition;
    static cb;

    static get observedAttributes() {
        return ["fade-in", "fade-out"];
    }

    connectedCallback() {
        let elem = this.template.querySelector("div");

        if (this.getAttribute("fade-out")) {
            elem.classList.add("fade-in");
        }

        let translationEvent = this.getTranslationEvent(elem);
        elem.addEventListener(translationEvent, (e) => {
            if (this.getAttribute("fade-out")) {
                document.body.removeChild(JworkTransition.currTransition);
                JworkTransition.currTransition = null;
                JworkTransition.cb();
                return;
            }
            JworkTransition.cb();
            JworkTransition.cb = function () { return; };
        });
    }

    attributeChangedCallback(name, newVal, oldVal) {
        setTimeout(() => {
            switch (name) {
                case "fade-in":
                    this.template.querySelector("div").classList.add("fade-in");
                    break;
                case "fade-out":
                    this.template.querySelector("div").classList.remove("fade-in");
                    break;
            }
        }, 100);
    }

    static fadeIn(callback = function () { return; }) {
        if (this.currTransition) return;

        this.cb = callback;
        this.currTransition = document.createElement("jwork-transition", { is: JworkTransition });
        document.body.appendChild(this.currTransition);
        this.currTransition.setAttribute("fade-in", "fade-in");
    }

    static fadeOut(callback = function () { return; }) {
        if (!this.currTransition) {
            return;
        }
        this.cb = callback;
        this.currTransition.setAttribute("fade-out", "fade-out");
    }

    getTranslationEvent(elem) {
        let transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (let t in transitions) {
            if (elem.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
}
