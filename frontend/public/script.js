let fetchedData;

const getData = async () => {

    // try {
        const response = await fetch('/api/pizza/');
        let data = await response.json();

        fetchedData = data;
        displayData()

    //   } catch (error) {
    //     if (error instanceof SyntaxError) {
    //       // Unexpected token < in JSON
    //       console.log('There was a SyntaxError', error);
    //     } else {
    //       console.log('There was an error', error);
    //     }
    //   }
   
}

const displayData = () => {
    // console.log(fetchedData);

    const rootEl = document.getElementById("root");

    fetchedData.types.forEach(element => {
        const divEl = document.createElement("div");
        divEl.innerHTML = element.name;
        rootEl.appendChild(divEl);
    });

}

const loadEvent = _ => {
    getData();
};

window.addEventListener("load", loadEvent);
