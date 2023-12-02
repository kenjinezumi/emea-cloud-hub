import setViews from "../../config/setViews";
import setSidebarDatepicker from "../menus/sidebarDatepicker";

import {
  createCheckIcon,
  createEditIcon,
} from "../../utilities/svgs";

import {
  getClosest,
  placePopup
} from "../../utilities/helpers";

const sidebarColTwo = document.querySelector(".sb__categories");
const cWrapper = document.querySelector(".sb__categories--body");
const categoriesContainer = document.querySelector(".sb__categories--body-form");
const categoriesHeader = document.querySelector(".sb__categories--header");
const categoriesHeaderEventStatus= document.querySelector(".sb__categories-event-status--header");

const categoryHeaderCaret = document.querySelector(".sbch-caret");
const categoryHeaderCaretEventStatus = document.querySelector(".sbch-caret-event-status");
const categoryHeaderCaretTiers = document.querySelector(".sbch-caret-tier");
const categoryHeaderCaretSeries = document.querySelector(".sbch-caret-series");

// const categoryHeaderCaret = document.querySelector(".sbch-caret");
// const categoryHeaderCaret = document.querySelector(".sbch-caret");
// const categoryHeaderCaret = document.querySelector(".sbch-caret");

// renders via menu click -- see ./renderViews.js


export default function handleSidebarCategories(context, store, datepickerContext) {
  const defaultCtg = store.getDefaultCtg();

  function updateComponent() {
    setViews(context.getComponent(), context, store, datepickerContext);
  }

  function renderSidebarDatepickerCtg() {
    setSidebarDatepicker(context, store, datepickerContext);
  }

  function renderCategories() {
    const ctg = store.getAllCtg();
    const keys = Object.keys(ctg);
    for (let i = 0; i < keys.length; i++) {
      let [ctgname, color, status] = [
        keys[i],
        ctg[keys[i]].color,
        ctg[keys[i]].active
      ];
      createCategoryListItem(ctgname, color, status);
    }
  }

  /**
   * 
   * @param {string} ctgname - category name
   * @param {string} ctgcolor - hex color
   * @param {Boolean} status - checked or not
   */
  function createCategoryListItem(ctgname, ctgcolor, status) {
    const row = document.createElement('div');
    row.classList.add('sbch-form--item');
    const colone = document.createElement('div');
    colone.classList.add('sbch-form--item__col');
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('sbch-form--item__checkbox--wrapper');
    const checkbox = document.createElement('button');
    checkbox.classList.add('sbch-form--item__checkbox');
    checkbox.setAttribute("data-sbch-checked", `${status}`);
    checkbox.setAttribute("data-sbch-category", ctgname);
    
    let checkIcon;
    if (status) {
      checkbox.style.backgroundColor = ctgcolor;
      checkIcon = createCheckIcon("var(--taskcolor0)");
    } else {
      checkbox.style.backgroundColor = "var(--black1)";
      checkIcon = createCheckIcon("none");
    }

    checkbox.style.border = `2px solid ${ctgcolor}`;
    checkbox.appendChild(checkIcon);
    checkboxWrapper.appendChild(checkbox);

    const label = document.createElement('span');
    label.classList.add('sbch-form--item__label');
    label.textContent = ctgname;
    colone.append(checkboxWrapper, label);

    const coltwo = document.createElement('div');
    coltwo.classList.add('sbch-form--item__col--actions');
    const deleteicon = document.createElement('button');
    deleteicon.classList.add('sbch-col--actions__delete-icon');
    deleteicon.setAttribute("data-sbch-category", ctgname);
    deleteicon.setAttribute("data-sbch-color", ctgcolor);
    const editicon = document.createElement('button');
    editicon.setAttribute("data-sbch-category", ctgname);
    editicon.setAttribute("data-sbch-color", ctgcolor);


    row.append(colone, coltwo);
    categoriesContainer.appendChild(row);
  }

  function handleCategoryModalToggle() {
    cWrapper.classList.toggle("toggle-category--modal");
    if (!cWrapper.classList.contains("toggle-category--modal")) {
      categoryHeaderCaret.classList.add("sbch-caret--open");
      categoryHeaderCaretEventStatus.classList.add("sbch-caret--open");
      categoryHeaderCaretTiers.classList.add("sbch-caret--open");
      categoryHeaderCaretSeries.classList.add("sbch-caret--open");


    } else {
      categoryHeaderCaret.classList.remove("sbch-caret--open");
      categoryHeaderCaretEventStatus.classList.remove("sbch-caret--open");
      categoryHeaderCaretTiers.classList.remove("sbch-caret--open");
      categoryHeaderCaretSeries.classList.remove("sbch-caret--open");


    }
    categoriesHeader.style.backgroundColor = "var(--black0)";
    categoriesHeaderEventStatus.style.backgroundColor = "var(--black0)";

    setTimeout(() => {
      categoriesHeader.style.backgroundColor = "var(--black1)";
      categoriesHeaderEventStatus.style.backgroundColor = "var(--black1)";

    }, 200);
  }



  function handleCategorySelection(e) {
    let checkbox = e.target.children[0].children[0];
    let status = checkbox.getAttribute("data-sbch-checked");
    let cat = checkbox.getAttribute("data-sbch-category");
    let color = store.getCtgColor(cat);
    if (status === "true") {
      checkbox.setAttribute("data-sbch-checked", "false");
      store.setCategoryStatus(cat, false);
      checkbox.style.backgroundColor = "var(--black1)";
      checkbox.firstChild.setAttribute("fill", "none");
    } else {
      checkbox.setAttribute("data-sbch-checked", "true");
      store.setCategoryStatus(cat, true);
      checkbox.style.backgroundColor = color;
      checkbox.firstChild.setAttribute("fill", "var(--taskcolor0)");
    }
    renderSidebarDatepickerCtg();
    updateComponent();
  }


  function delegateCategoryEvents(e) {
    const ctgtoggleModal = getClosest(e, ".sbch-col__one");
    const ctgChck = getClosest(e, ".sbch-form--item__col");

    if (ctgtoggleModal) {
      handleCategoryModalToggle();
      return;
    }
    

    // toggle category checkbox and display entries
    if (ctgChck) {
      handleCategorySelection(e);
      return;
    }

  }

  const initSidebarCategories = () => {
    renderCategories();
    const fullCtgRender = () => {
      renderCategories();
      updateComponent();
    };
    store.setRenderCategoriesCallback(fullCtgRender);
    sidebarColTwo.onmousedown = delegateCategoryEvents;
  };
  initSidebarCategories();
}