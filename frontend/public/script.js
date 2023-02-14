let fetchedData;
let gridContainerEl;

const getData = async () => {
  try {
  let image = document.createElement("img");
  document.body.append(image);
  image.src =
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif";
  const response = await fetch("/api/pizza/");
  fetchedData = await response.json();
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

    fetchedData.types.forEach(pizza => {
        let cardEl = `
        <div class="card pizzaItemContainer" style="width: 16rem;">
        <img src="${pizza.img}" class="card-img-top" alt="..." style = "position: relative">
        <div class="card-body">
            <h5 class="card-title">${pizza.name}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
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
