import { interimArea } from "./interim-area.js";
import { press } from "../UserScriptUtils/keyboard-emulation.js";
import { insertText } from "../UserScriptUtils/insert-text.js";
import { scrapboxDOM } from "../UserScriptUtils/scrapbox-dom.js";

const PAGE_MENU_ID = "speech input";
const ICONS = {
  ENABLED: "https://i.gyazo.com/0562c6a405a29661f18d0fdf8840065d.png",
  DISABLED: "https://img.icons8.com/ios/4096/microphone.png",
};

const toEnabledIcon = () => {
  document.getElementById(PAGE_MENU_ID).firstElementChild.src = ICONS.ENABLED;
};
const toDisabledIcon = () => {
  document.getElementById(PAGE_MENU_ID).firstElementChild.src = ICONS.DISABLED;
};

const isSupportSpeechRecognition = () => {
  window.SpeechRecognition =
    window.webkitSpeechRecognition ?? window.SpeechRecognition;
  return SpeechRecognition !== undefined;
};

const isMobile = () => /mobile/i.test(navigator.userAgent);

class PromiseQueue {
  queue = Promise.resolve(true);

  add(fn) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue.then(fn).then(resolve).catch(reject);
    });
  }
}

const newline = async () => {
  return press(13 /* Enter */);
};

const main = () => {
  try {
    if (!isSupportSpeechRecognition()) {
      alert("SpeechRecognition is not available on this browser.");
      return;
    }

    const pq = new PromiseQueue();

    let cursorHack = false;

    let isRunning = false;

    // 強制停止フラグ
    let terminate = false;

    // 何らかの音声認識に成功したら立てる
    let recognized = false;

    // 最終タイムスタンプ
    let recognizedTimeStamp = Infinity;

    const interim = interimArea();
    scrapboxDOM.textInput.parentElement.append(interim);

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.addEventListener("result", async (e) => {
      recognized = true;
      const result = Array.from(e.results).at(-1);
      if (result.isFinal) {
        interim.hide();

        pq.add(insertText(result[0].transcript));

        if (e.timeStamp - recognizedTimeStamp > 500) {
          pq.add(newline);
        }

        recognizedTimeStamp = e.timeStamp;
        cursorHack = true;
      } else {
        // 暫定の認識結果
        interim.setText(result[0].transcript);
        interim.show();
        interim.setPosition({
          height: scrapboxDOM.textInput.style.height,
          top: cursorHack
            ? `calc(${scrapboxDOM.textInput.style.top} + 14px)`
            : scrapboxDOM.textInput.style.top,
          left: scrapboxDOM.textInput.style.left,
          lineHeight: scrapboxDOM.textInput.style.lineHeight,
        });
      }
    });

    recognition.addEventListener("start", () => {
      isRunning = true;
      recognized = false;
      terminate = false;
      cursorHack = false;
      toEnabledIcon();
    });

    recognition.addEventListener("end", async (e) => {
      interim.hide();
      // mobileで音声入力を継続させる
      // 条件：page menuを押していない かつ 前回何らかの音声認識に成功した
      if (isMobile() && !terminate && recognized) {
        recognition.start();
        return;
      }
      isRunning = false;
      toDisabledIcon();
    });

    scrapbox.PageMenu.addMenu({
      title: PAGE_MENU_ID,
      image: ICONS.DISABLED,
      onClick: () => {
        if (!isRunning) {
          recognition.start();
        } else {
          recognition.stop();
          terminate = true;
        }
      },
    });
  } catch (error) {
    console.error(error);
  }
};

main();
