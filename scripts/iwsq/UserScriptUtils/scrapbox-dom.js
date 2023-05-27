class ScrapboxDOM {
  get editor() {
    return document.getElementById("editor");
  }
  get lines() {
    return document.getElementsByClassName("lines")?.[0];
  }
  get computeLine() {
    return document.getElementById("compute-line");
  }
  get grid() {
    return document
      .getElementsByClassName("related-page-list clearfix")?.[0]
      ?.getElementsByClassName("grid")?.[0];
  }
  get cursorLine() {
    return document.getElementsByClassName("cursor-line")?.[0];
  }
  get textInput() {
    return document.getElementById("text-input");
  }
  get cursor() {
    return document.getElementsByClassName("cursor")?.[0];
  }
  get selections() {
    return document.getElementsByClassName("selections")?.[0];
  }
  get popupMenu() {
    return document.getElementsByClassName("popup-menu")?.[0];
  }
  get pageMenus() {
    return document.getElementsByClassName("page-menu")?.[0];
  }
  get pageInfoMenu() {
    return document.getElementById("page-info-menu");
  }
  get pageEditMenu() {
    return document.getElementById("page-edit-menu");
  }
  get pageEditButtons() {
    return this.pageEditMenu.nextElementSibling.getElementsByTagName("a");
  }
  get randomJumpButton() {
    return document.getElementsByClassName("random-jump-button")?.[0];
  }
  get pageCustomButtons() {
    return document.getElementsByClassName("page-menu-extension");
  }
}

export const scrapboxDOM = new ScrapboxDOM();
