let pizzaData;
let allergensData;
let gridContainerEl, navBarDiv, rootEl, buttonSearch, filterdiv;
let checkBox, toBeListed;
let orderFormat = {
  id: 1,
  pizzas: [],
  date: {
    year: 2022,
    month: 6,
    day: 7,
    hour: 18,
    minute: 47,
  },
  customer: {
    name: "John Doe",
    email: "jd@example.com",
    address: {
      city: "Palermo",
      street: "Via Appia 6",
    },
  },
};

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
  gridContainerEl.innerHTML = "";
  pizzaData.forEach((pizza, i) => {
    let allergensToDisplay = pizza.allergens.map(
      (elem) => (elem = allergensData[elem - 1].name)
    );
    let cardEl = `
    <div id="${pizza.id}" class="card pizzaItemContainer">
    <img src="${
      pizza.img
    }" class="card-img-top" alt="..." style = "position: relative">
    <div class="card-body">
    <h2 class="card-title">${pizza.name}</h2>
    <p class="card-text">Allergens: ${allergensToDisplay.join(", ")}</p>
    </div>  
    <ul class="list-group list-group-flush listCSS">
      <li class="list-group-item">An item</li>
      <li class="list-group-item">A second item</li>
      <li class="list-group-item">A third item</li>
    </ul>
        <div class="card-body">

        </div>

        <div id="pqContainer">
          <div id="price">${pizza.price}RON</div>
          <div id="quantityCont">
            <div class="quantityMinusBttn">-</div>
            <div class="quantityCounter">1</div>
            <div class="quantityPlusBttn">+</div>
          </div>
        </div>

        <div class="orderBttn">Order</div>
    </div>`;

    if (toBeListed[i]) {
      gridContainerEl.insertAdjacentHTML("beforeend", cardEl);
    }
  });
  completeOrderDetails();
};

const completeOrderDetails = () => {
  const orderButtons = document.querySelectorAll(".orderBttn");
  const quantityMinusButtons = document.querySelectorAll(".quantityMinusBttn");
  const quantityPlusButtons = document.querySelectorAll(".quantityPlusBttn");

  orderButtons.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      addPizzaToOrder(event);
    });
  });

  quantityMinusButtons.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      modifyQuantity(-1, event);
    });
  });

  quantityPlusButtons.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      modifyQuantity(1, event);
    });
  });


};

const addPizzaToOrder = (event) => {
  let parent = event.target.parentElement;
  let amount = parent.querySelector(".quantityCounter").innerText;
  let pizzaOrder = {
    id: parent.id,
    amount: amount,
  };
  orderFormat.pizzas.push(pizzaOrder);
};

const modifyQuantity = (iterator, event) => {
  const counter = event.target.parentElement.querySelector(".quantityCounter");
  counter.innerText = counter.innerText * 1 + iterator;
};

const loadEvent = (_) => {
  getData();
};

window.addEventListener("load", loadEvent);
