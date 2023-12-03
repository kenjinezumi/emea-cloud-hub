import setViews from "../../config/setViews";
import setSidebarDatepicker from "../menus/sidebarDatepicker";
import categories from "../../context/categories";
import {
  createCheckIcon,
} from "../../utilities/svgs";



const sidebarColTwo = document.querySelector(".sb__categories");
const categoriesContainer = document.querySelector(".sb__categories--body-form");


// renders via menu click -- see ./renderViews.js

const caretList = [];

export default function handleSidebarCategories(context, store, datepickerContext) {
  const defaultCtg = store.getDefaultCtg();

  function updateComponent() {
    setViews(context.getComponent(), context, store, datepickerContext);
  }

  function renderSidebarDatepickerCtg() {
    setSidebarDatepicker(context, store, datepickerContext);
  }

  function renderCategories() {
    const categoriesContainer = document.querySelector('.sb__categories--body-form');
  
    Object.keys(categories).forEach(categoryKey => {
      const category = categories[categoryKey];
  
      // Create Category Header
      const categoryHeader = document.createElement('div');
      categoryHeader.classList.add('sbch-col__one');
  
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('sbch-title');
      titleDiv.textContent = category.title;
      categoryHeader.appendChild(titleDiv);

      const caretDiv = document.createElement('div');
      caretDiv.classList.add(`sbch-caret-${categoryKey}`, 'sbch-caret--open');
      caretList.push(`sbch-caret-${categoryKey}`);  // Add the caret identifier to the caretList
      console.log(caretList)
      caretDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="var(--white2)"><path d="m12 15.375-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4Z"/></svg>`;
      categoryHeader.appendChild(caretDiv);
  
      categoriesContainer.appendChild(categoryHeader);
  
      // Create Category Options
      Object.keys(category.options).forEach(optionKey => {
        const option = category.options[optionKey];
        createCategoryListItem(optionKey, option.color, option.active);
      });
    });
  }
  

  /**
   * sb__categories
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

  function handleCategoryModalToggle(clickedCaret) {


    // Find the closest header element
    const categoryHeader = clickedCaret.closest('.sbch-col__one');
    if (!categoryHeader) {
        console.log('Category header not found');
        return;
    }

    // Assuming the next sibling element of the header is the category body
    const categoryBody = categoryHeader.nextElementSibling;
    if(categoryBody) {
        categoryBody.classList.toggle("toggle-category--modal");
    } else {
        console.log('Category body not found');
    }

    // Toggle the caret orientation
    clickedCaret.classList.toggle("sbch-caret--open");
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
    // Check if a caret was clicked
    const caretElement = e.target.closest("[class^='sbch-caret']");


    if (caretElement) {
        handleCategoryModalToggle(caretElement);
        return;
    } else {
      console.log('Not clicked');
    }

    // Handle category selection
    if (e.target.closest(".sbch-form--item__col")) {
        handleCategorySelection(e);
    }
}


  

const initSidebarCategories = () => {
  renderCategories();
  const fullCtgRender = () => {
      renderCategories();
      updateComponent();
  };
  store.setRenderCategoriesCallback(fullCtgRender);
  sidebarColTwo.addEventListener('mousedown', delegateCategoryEvents);
};

initSidebarCategories();
}