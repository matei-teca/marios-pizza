let pizzaData;
let allergensData;
let gridContainerEl,
  navBarDiv,
  rootEl,
  buttonSearch,
  filterdiv,
  cartButton,
  cartImg;
let checkBox, toBeListed;
let itemsInCart = 0;
let orderFormat = {
  id: 0,
  pizzas: [],
  date: {},
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
  buttonSearch = createEl(
    "button",
    filterdiv,
    "id",
    "buttonSearch",
    "class",
    "btn btn-success"
  );
  buttonSearch.innerText = "Filter";
  checkBox = createEl("div", filterdiv, "id", "checkBox");
  checkBox.hidden = "hidden";
  for (let alergen of allergensData) {
    let label = createEl("label", checkBox);
    let row = createEl("input", label, "type", "checkbox");
    row.value = alergen.name;
    row.id = alergen.id;
    label.innerHTML += alergen.name;
  }
  buttonSearch.addEventListener("click", listAlergens);

  let applyFilter = createEl(
    "button",
    checkBox,
    "id",
    "applyFilter",
    "class",
    "btn btn-success"
  );
  applyFilter.innerText = "Apply filter";
  applyFilter.addEventListener("click", filterByAlergens);

  cartButton = createEl(
    "button",
    navBarDiv,
    "id",
    "cartButton",
    "type",
    "button",
    "class",
    "btn btn-success"
  );
  cartButton.innerText = `Cart(${itemsInCart})`;

  let popupContainer = document.querySelector("#popupContainer");

  cartButton.addEventListener("click", () => {
    popupContainer.style.display = "flex";
  });
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
  pizzaData.forEach((pizza, i) => {
    let bool = false;
    console.log(pizza.allergens);
    for (allergen of checkedBoxes) {
      console.log(allergen.id);
      if (pizza.allergens.includes(allergen.id * 1)) {
        bool = true;
        break;
      }
    }
    if (bool) {
      toBeListed[i] = false;
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
    <div id="${pizza.id}" class="pizzaItemContainer">
      <img src="${pizza.img}" alt="..." style = "position: relative">
      <div class="text-center">
        <h2>${pizza.name}</h2>
        <p><strong>Allergens</strong>: ${allergensToDisplay.join(", ")}</p>
      </div>
      <div id="ingredients">
        <button id="ingredientsButton">Ingredients</button>
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
  showIngredients()
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
  let amount = parent.querySelector(".quantityCounter");
  let pizzaOrder = {
    id: parent.id,
    amount: amount.innerText * 1,
  };
  let bool = true;
  for (let pizza of orderFormat.pizzas) {
    if (pizza.id === pizzaOrder.id) {
      pizza.amount += pizzaOrder.amount;
      bool = false;
    }
  }
  if (bool) {
    orderFormat.pizzas.push(pizzaOrder);
    cartButton.innerText = `Cart(${++itemsInCart})`;
  }
  amount.innerText = 1;
};

const modifyQuantity = (iterator, event) => {
  const counter = event.target.parentElement.querySelector(".quantityCounter");
  counter.innerText = counter.innerText * 1 + iterator;
};

const formStructure = () => {
  return `
  <div id = "popupContainer">
    <div id = "formContainer">
      <form id="formular">
        <div id="title" class="formItem">
          Order Details
        </div>
        <div class="formItem">
          <label for="name">Name:</label>
          <input type="text" id="name" class="input" name="name">
        </div>
        <div class="formItem">
          <label for="email">Email:</label>
          <input type="text" id="email" class="input" name="email">
        </div>
        <div class="formItem">
          <label for="city">City:</label>
          <input type="text" id="city" class="input" name="city">
        </div>
        <div class="formItem">
          <label for="street">Street:</label>
          <input type="text" id="street" class="input" name="street">
        </div>
        <button id="submitBttn" class="btn btn-success" type="submit" form="formular">Complete Order</button>
      </form>
    </div>
  </div>
  `;
};

const displayForm = () => {
  document.body.insertAdjacentHTML("beforeend", formStructure());
  getFormDetails();
};

const getFormDetails = () => {
  const formular = document.querySelector("#formular");
  formular.addEventListener("submit", (event) => {
    event.preventDefault()
    let data = new FormData(formular);
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });

    orderFormat.customer.name = object.name;
    orderFormat.customer.email = object.email;
    orderFormat.customer.address.city = object.city;
    orderFormat.customer.address.street = object.street;

    popupContainer.style.display = "none";

    addDateToOrder()

    postOrderReq()
  });
};

const addDateToOrder = () => {
  let date = new Date()
  orderFormat.date = {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

const postOrderReq = () => {
  fetch("/api/order", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(orderFormat)
  })
}

const showIngredients = () => {
  const ingredientsButtons = document.querySelectorAll("#ingredientsButton")

  ingredientsButtons.forEach(elem => {
    elem.addEventListener("click", (event) => {
      displayIngredients(event)
      console.log("heo")
    })
  })
}

const displayIngredients = (event) => {
  let parent = event.target.parentElement
  let id = parent.parentElement.id - 1
  console.log(parent, id)

  pizzaData[id].ingredients.forEach(elem => {
    let ingredient = createEl("div", parent)
    ingredient.innerText = elem
    
    let quantitiContainer = createEl("div", ingredient, "class", "ingredientsContainer")
    let minusButton = createEl("div", quantitiContainer, "class", "quantityMinusBttn")
    minusButton.innerText = "-"
    let numberButton = createEl("div", quantitiContainer, "class", "quantityCounter")
    numberButton.innerText = 1
    let plusButton = createEl("div", quantitiContainer, "class", "quantityPlusBttn")
    plusButton.innerText = "+"

  })
}

const loadEvent = (_) => {
  getData();
  displayForm();
};

window.addEventListener("load", loadEvent);
