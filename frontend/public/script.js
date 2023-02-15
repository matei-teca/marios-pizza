let pizzaData;
let allergensData;
let gridContainerEl, navBarDiv, rootEl, buttonSearch, filterdiv;
let checkBox, toBeListed;

const createEl = (
  type,
  parent,
  atr1,
  atr1Name,
  atr2,
  atr2Name,
  atr3,
  atr3Name
) => {
  let el = document.createElement(type);
  if (atr1 != undefined) el.setAttribute(atr1, atr1Name);
  if (atr2 != undefined) el.setAttribute(atr2, atr2Name);
  if (atr3 != undefined) el.setAttribute(atr3, atr3Name);
  if (parent != undefined) parent.append(el);
  return el;
};

const getData = async () => {
  try {
    let image = document.createElement("img");
    document.body.append(image);
    image.src =
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif";
    const response = await fetch("/api/pizza/");
    pizzaData = await response.json();
    const responseAllergens = await fetch("/api/allergens/");
    allergensData = await responseAllergens.json();
    toBeListed = new Array(pizzaData.length).fill(true);
    image.style.display = "none";
    displayNavBar();
    gridContainerEl = createEl("div", rootEl, "class", "grid-container");
    displayPizzaItems();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("There was a SyntaxError", error);
    } else {
      console.log("There was an error", error);
    }
  }
};

const displayNavBar = () => {
  rootEl = document.getElementById("root");
  navBarDiv = createEl("div", rootEl, "id", "navBarDiv");
  filterdiv = createEl("div", navBarDiv, "id", "filterdiv");
  buttonSearch = createEl("button", filterdiv, "id", "buttonSearch");
  buttonSearch.innerText = "Filter";
  checkBox = createEl("div", filterdiv, "id", "checkBox");
  checkBox.hidden = "hidden";
  for (let alergen of allergensData) {
    let label = createEl("label", checkBox);
    let row = createEl("input", label, "type", "checkbox");
    row.value = alergen.name;
    label.innerHTML += alergen.name;
  }
  buttonSearch.addEventListener("click", listAlergens);
  let applyFilter = createEl("button", checkBox, "id", "applyFilter");
  applyFilter.innerText = "Apply filter";
  applyFilter.addEventListener("click", filterByAlergens);
};

const listAlergens = () => {
  if (checkBox.hidden === true) {
    checkBox.hidden = "";
  } else {
    checkBox.hidden = "hidden";
  }
};

const filterByAlergens = () => {
  let checkedBoxes = document.querySelectorAll("input:checked");
  let pharagraphs = document.querySelectorAll("div>p");
  pharagraphs.forEach((p, i) => {
    let bool = false;
    for (allergen of checkedBoxes) {
      console.log(allergen.value);
      if (p.innerText.includes(allergen.value)) {
        bool = true;
        break;
      }
    }
    if (bool) {
      toBeListed[i] = false;
      // p.parentElement.parentElement.remove();
    }
  });
  displayPizzaItems();
  toBeListed.fill(true);
};

const displayPizzaItems = () => {

    const rootEl = document.getElementById("root");

    gridContainerEl = document.createElement("div");
    gridContainerEl.className = "grid-container";
    rootEl.appendChild(gridContainerEl);

    pizzaData.forEach(pizza => {
        let allergensToDisplay = pizza.allergens.map(elem => elem = allergensData[elem - 1].name)
        let cardEl = `
        <div class="card pizzaItemContainer" style="width: 18rem;">
        <img src="${pizza.img}" class="card-img-top" alt="..." style = "position: relative">
        <div class="card-body">
            <h5 class="card-title">${pizza.name}</h5>
            <p class="card-text">Allergens: ${allergensToDisplay.join(", ")}</p>
        </div>  
        <ul class="list-group list-group-flush">
            <li class="list-group-item">An item</li>
            <li class="list-group-item">A second item</li>
            <li class="list-group-item">A third item</li>
        </ul>
        <div class="card-body">
            <a href="#" class="card-link">Card link</a>
        </div>
        </div>`

        gridContainerEl.insertAdjacentHTML("beforeend", cardEl);

    })


    
}

// const displayData = () => {

//   const rootEl = document.getElementById("root");

//     gridContainerEl = document.createElement("div");
//   gridContainerEl.className = "grid-container";
//   rootEl.appendChild(gridContainerEl);

//   fetchedData.types.forEach((element) => {
//     const divEl = document.createElement("div");
//     divEl.innerHTML = element.name;
//     divEl.id = `${element.name}`;
//     divEl.className = "pizzaItemContainer";
//     gridContainerEl.appendChild(divEl);
//   });
// };

const loadEvent = (_) => {
  getData();
};

window.addEventListener("load", loadEvent);
