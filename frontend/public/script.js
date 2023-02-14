let pizzaData;
let allergensData;
let gridContainerEl;

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

  image.style.display = "none";
  displayPizzaItems();
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('There was a SyntaxError', error);
      } else {
        console.log('There was an error', error);
      }
    }
};

const displayPizzaItems = () => {

    const rootEl = document.getElementById("root");

    gridContainerEl = document.createElement("div");
    gridContainerEl.className = "grid-container";
    rootEl.appendChild(gridContainerEl);

    pizzaData.forEach(pizza => {
        let allergensToDisplay = pizza.allergens.map(elem => elem = allergensData[elem - 1].name)
        let cardEl = `
        <div class="card pizzaItemContainer" style="width: 12rem;">
        <img src="${pizza.img}" class="card-img-top" alt="..." style = "position: relative">
        <div class="card-body">
            <h5 class="card-title">${pizza.name}</h5>
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
          <div id="price">40RON</div>
          <div id="quantityCont">
            <div id="quantityLeftBttn">-</div>
            <div id="quantityNbr">1</div>
            <div id="quantityRightBttn">+</div>
          </div>
        </div>

        <div id="orderBttn">Order</div>
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
