import { scrapboxDOM } from "./scrapbox-dom.js";
import { sleep } from "./sleep.js";

export const insertText = async (text, { wait = 1 } = {}) => {
  const cursor = scrapboxDOM.textInput;
  cursor.focus();
  cursor.value = text;

  const uiEvent = document.createEvent("UIEvent");
  uiEvent.initEvent("input", true, false);
  cursor.dispatchEvent(uiEvent);

  await sleep(wait);
};
