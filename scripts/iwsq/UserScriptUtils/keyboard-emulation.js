import { scrapboxDOM } from "../UserScriptUtils/scrapbox-dom.js";

/**
 *
 * @param {KeyboardEvent["keyCode"]} keyCode
 */
export const press = (
  keyCode,
  { shiftKey = false, ctrlKey = false, altKey = false } = {}
) => {
  const options = {
    bubbles: true,
    cancelable: true,
    keyCode,
    shiftKey: shiftKey,
    ctrlKey: ctrlKey,
    altKey: altKey,
  };
  scrapboxDOM.textInput.dispatchEvent(new KeyboardEvent("keydown", options));
  scrapboxDOM.textInput.dispatchEvent(new KeyboardEvent("keyup", options));
};
