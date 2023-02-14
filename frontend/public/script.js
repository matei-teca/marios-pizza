let fetchedData;

const getData = async () => {
  try {
  let image = document.createElement("img");
  document.body.append(image);
  image.src =
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif";
  const response = await fetch("/api/pizza/");
  fetchedData = await response.json();
  image.style.display = "none";
  displayData();
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('There was a SyntaxError', error);
      } else {
        console.log('There was an error', error);
      }
    }
};

const displayData = () => {

  const rootEl = document.getElementById("root");

  const gridContainerEl = document.createElement("div");
  gridContainerEl.className = "grid-container";
  rootEl.appendChild(gridContainerEl);

  fetchedData.types.forEach((element) => {
    const divEl = document.createElement("div");
    divEl.innerHTML = element.name;
    divEl.id = `${element.name}`;
    divEl.className = "pizzaItemContainer";
    gridContainerEl.appendChild(divEl);
  });
};

const loadEvent = (_) => {
  getData();
};

window.addEventListener("load", loadEvent);
