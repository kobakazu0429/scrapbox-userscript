const css = `
:host {
  color: #777;
  display: inline-block;
  position: absolute;
  min-width: 10em;
}
`;

customElements.define(
  "interim-area",
  class extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>${css}</style><slot></slot>`;
    }

    setText(text) {
      this.textContent = text;
    }

    setPosition({ height, top, left, lineHeight }) {
      this.style.height = height;
      this.style.top = top;
      this.style.left = left;
      this.style.lineHeight = lineHeight ?? "18px";
    }

    show() {
      this.hidden = false;
    }

    hide() {
      this.hidden = true;
    }
  }
);

export const interimArea = () => document.createElement("interim-area");
