let pizzaData;
let allergensData;
let gridContainerEl,
  navBarDiv,
  rootEl,
  buttonSearch,
  filterdiv,
  cartButton,
  cartImg,
  regex = /[1234567890-=!@#$%^&*()_+;'.\/,\\{}":??><]+/;
let checkBox, toBeListed;
let itemsInCart = 0,
  subtotal = 0;
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
  buttonSearch = createEl("button", filterdiv, "id", "buttonSearch");
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
    "button"
  );
  cartButton.innerText = `Cart(${itemsInCart})`;

  let popupContainer = document.querySelector("#popupContainer");

  cartButton.addEventListener("click", () => {
    popupContainer.style.display = "flex";
    addPizzaToOrderList();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") popupContainer.style.display = "none";
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

const addPizzaToOrderList = () => {
  const orderList = document.querySelector("#orderList");
  const subtotalP = document.querySelector("#subtotal");
  const totalP = document.querySelector("#total");

  orderList.innerHTML = "";
  orderFormat.pizzas.forEach((pizza) => {
    const pizzaItem = createEl("div", orderList, "class", "pizzaItem");
    const name = createEl("p", pizzaItem, "class", "pizzaName");
    name.innerHTML = `<strong>${pizzaData[pizza.id - 1].name}</strong> <br> ${
      pizza.amount
    } x ${
      pizzaData[pizza.id - 1].price
    }&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${
      pizza.amount * pizzaData[pizza.id - 1].price
    }RON `;
    const cancelBtn = createEl(
      "button",
      pizzaItem,
      "class",
      "btn-close cancelBtn",
      "id",
      `${pizza.id}`
    );
    cancelBtn.addEventListener("click", (event) => {
      deletePizza(event);
    });
    subtotal += pizza.amount * pizzaData[pizza.id - 1].price;
  });
  subtotalP.innerText = `${subtotal} RON`;
  totalP.innerText = `${subtotal + 70} RON`;
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
      <div id="ingredients${pizza.id}" class="ingredients">
        <button id="ingredientsButton" value="+">Ingredients</button>
      </div>
      <div id="pqContainer">
        <div id="price">${pizza.price}RON</div>
        <div id="quantityCont">
          <div class="quantityMinusBttn nrpizzas">-</div>
          <div class="quantityCounter nrpizzas">1</div>
          <div class="quantityPlusBttn nrpizzas">+</div>
        </div>
      </div>

      <div class="orderBttn">Order</div>
    </div>`;

    if (toBeListed[i]) {
      gridContainerEl.insertAdjacentHTML("beforeend", cardEl);
    }
    displayIngredients(pizza.id);
  });
  completeOrderDetails();
  showIngredients();
};

const deletePizza = (event) => {
  const subtotalP = document.querySelector("#subtotal");
  const totalP = document.querySelector("#total");
  let amount;
  let content = event.target.parentElement;
  orderFormat.pizzas = orderFormat.pizzas.filter((pizza, poz) => {
    if (pizza.id !== event.target.id) {
      return true;
    }
    amount = pizza.amount;
    return false;
  });
  subtotal -= pizzaData[event.target.id * 1 - 1].price * amount;
  subtotalP.innerText = `${subtotal} RON`;
  totalP.innerText = `${subtotal + 70} RON`;
  content.remove();
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
  let amount = parent.querySelector(".quantityCounter.nrpizzas");
  let pizzaOrder = {
    id: parent.id,
    amount: amount.innerText * 1,
  };
  console.log(amount);
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
  <div id = "popupContainer" class="modal">
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
        <div id="errorMessage"></div>
        <button id="submitBttn" class="btn btn-success" type="submit" form="formular">Complete Order</button>
      </form>
    </div>

  </div>
  `;
};

const displayForm = () => {
  document.body.insertAdjacentHTML("beforeend", formStructure());
  getFormDetails();
  displayOrderDetails();
};

const displayOrderDetails = () => {
  const popupContainerEl = document.getElementById("popupContainer");
  popupContainerEl.insertAdjacentHTML("beforeend", orderDetialsStructure());
};

const orderDetialsStructure = () => {
  return `<div class="modal-dialog" id = "orderDetailsContainer">
  <div class="modal-content">
    <div class="modal-header">
      <h4 class="modal-title">Order List</h4>
    </div>

    <div class="modal-body">
      <div class="modal-body text-start text-black p-4">
      <div id="orderList">
      </div>
      <p class="mb-0" style="color: #35558a;">Payment summary</p>
      <hr class="mt-2 mb-4"
        style="height: 0; width: 500px; background-color: transparent; opacity: .75; border-top: 2px dashed #9e9e9e;">

      <div class="d-flex justify-content-between">
        <p class="fw-bold mb-0">Subtotal</p>
        <p id="subtotal" class="text-muted mb-0">${subtotal} RON</p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="small mb-0">Delivery</p>
        <p class="small mb-0">30 RON</p>
      </div>

      <div class="d-flex justify-content-between pb-1">
        <p class="small">Tax</p>
        <p class="small">40 RON</p>
      </div>

      <div class="d-flex justify-content-between">
        <p class="fw-bold">Total</p>
        <p id="total" class="fw-bold" style="color: #35558a;">${
          subtotal + 70
        } RON</p>
      </div>

    </div>

    </div>

  </div>
</div>
`;
};

const getFormDetails = () => {
  const formular = document.querySelector("#formular");
  const errorDiv = document.querySelector("#errorMessage");
  formular.addEventListener("submit", (event) => {
    event.preventDefault();
    let data = new FormData(formular);
    let object = {};
    data.forEach((value, key) => {
      object[key] = value;
    });
    if (orderFormat.pizzas.length === 0) {
      errorDiv.innerText = "There is no Pizza in Order List";
    } else if (regex.test(object.name)) {
      errorDiv.innerText = "Invalid character in name";
      console.log("Invalid character in name");
    } else {
      orderFormat.customer.name = object.name;
      orderFormat.customer.email = object.email;
      orderFormat.customer.address.city = object.city;
      orderFormat.customer.address.street = object.street;

      popupContainer.style.display = "none";
      addDateToOrder();
      postOrderReq();
    }
  });
};

const addDateToOrder = () => {
  let date = new Date();
  orderFormat.date = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

const postOrderReq = async () => {
  await fetch("/api/order", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(orderFormat),
  });

  getOrdersRequest();
};

const showIngredients = () => {
  const ingredientsButtons = document.querySelectorAll("#ingredientsButton");
  const minusIngredients = document.querySelectorAll(".minusIngredients");
  const plusIngredients = document.querySelectorAll(".plusIngredients");
  let counter;

  ingredientsButtons.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      console.log(event.target.nextElementSibling);
      // displayIngredients(event)
      switch (event.target.value) {
        case "+":
          event.target.nextElementSibling.style.display = "block";
          event.target.value = "-";
          break;
        case "-":
          event.target.nextElementSibling.style.display = "none";
          event.target.value = "+";
          break;
      }
    });
  });

  minusIngredients.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      counter = event.target.nextElementSibling;
      if (counter.innerText * 1 < 0) counter.innerText = 0;
    });
  });

  plusIngredients.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      counter = event.target.previousElementSibling;
      if (counter.innerText * 1 > 2) counter.innerText = 2;
    });
  });
};

const displayIngredients = (id) => {
  let parent = document.getElementById(`ingredients${id}`);
  let ingredientsList = createEl("div", parent, "class", "ingredientsList");

  pizzaData[id - 1].ingredients.forEach((elem) => {
    let ingredient = createEl("div", ingredientsList);
    ingredient.innerText = elem;

    let quantitiContainer = createEl(
      "div",
      ingredient,
      "class",
      "ingredientsContainer"
    );

    let minusButton = createEl(
      "div",
      quantitiContainer,
      "class",
      "quantityMinusBttn minusIngredients"
    );
    minusButton.innerText = "-";
    let numberButton = createEl(
      "div",
      quantitiContainer,
      "class",
      "quantityCounter limit"
    );
    numberButton.innerText = 1;
    let plusButton = createEl(
      "div",
      quantitiContainer,
      "class",
      "quantityPlusBttn plusIngredients"
    );
    plusButton.innerText = "+";
  });
};

const getOrdersRequest = async () => {
  try {
    let response = await fetch("/api/order");
    let data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("There was a SyntaxError", error);
    } else {
      console.log("There was an error", error);
    }
  }
};

const passOrdersResponseData = (data) => {
  let getOrdersDataBttnEl = document.createElement("button");
  getOrdersDataBttnEl.id = "getOrdersDataBttn";
  getOrdersDataBttnEl.innerText = "Get Orders";

  document.body.appendChild(getOrdersDataBttnEl);

  getOrdersDataBttnEl.addEventListener("click", async () => {
    let fetchedData = await getOrdersRequest();
    console.log(fetchedData);
  });
};

const loadEvent = (_) => {
  getData();
  displayForm();
  getOrdersRequest();
  passOrdersResponseData();
};

window.addEventListener("load", loadEvent);
