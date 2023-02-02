// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

type Character = {
  name: string;
  height: string;
  mass: string;
  // power: string;
};

const getFreshData = async (url: string) => {
  let characterTableInfo: Character[] = [];
  let response: Response = await fetch(url);
  let data = await response.json();

  const parseCharacterData = (data: { results: any[] }) => {
    data.results.forEach((character) => {
      let { name, height, mass } = character;

      characterTableInfo.push({
        name,
        height,
        mass,
      });
    });
  };

  parseCharacterData(data);

  // Loop for all subseqent fetches
  while (data.next !== null) {
    response = await fetch(data.next);
    data = await response.json();
    parseCharacterData(data);
  }

  localStorage.setItem("tableData", JSON.stringify(characterTableInfo));
};

export function runVanillaApp() {



  // Multiplier Element Logic
  let multiplierElement: HTMLInputElement = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;

  document.addEventListener("keydown", function(event) {
    const key = event.key; // Or const {key} = event; in ES6+
    if (key === "Escape") {
      console.log("I've been escaped!")
      multiplierElement.value = "10"
      handleMultiplierChange(event)
        // Do things
    }
});

  // Handler/Event listener for multiplierElement
  function handleMultiplierChange(e: Event) {
    if (multiplierElement) {
      let intMultiplierVal = parseInt((e.target as HTMLInputElement).value) || 10;
      let tableBody = document?.querySelector("#tbody");
      // Below line is now getting table ROWS
      let rows = tableBody?.querySelectorAll("tbody tr");
      if (rows) {
        rows.forEach((row) => {
          let intHeight = parseInt(row.cells[1].textContent);
          let intMass = parseInt(row.cells[2].textContent);
          let newPower =
            intMass && intHeight
              ? (
                  intMass *
                  intHeight *
                  intMultiplierVal
                ).toString()
              : "-";

          row.cells[3].textContent = newPower;
        });
      }
    }
  }

  // Add event listener to multiplierElement
  if (multiplierElement) {
    multiplierElement.addEventListener("input", handleMultiplierChange);
/*     multiplierElement.addEventListener("keydown", function(event) {
      const {key} = event;
      if (key === "Escape") {
        multiplierElement.value = "10"
      }
  }); */

  }

  // LOAD DATA INTO TABLE - This function loads data into the table
  async function loadDataIntoTable(table: HTMLElement | null) {
    const tableBody: HTMLTableSectionElement | null | undefined =
      table?.querySelector("tbody");
    const cacheData = localStorage.getItem("tableData");

    if (tableBody && cacheData) {
      let characterTableInfo = JSON.parse(cacheData);
      // Clear the table of any existing data
      tableBody.innerHTML = "";

      characterTableInfo.forEach((characterRow: Character) => {
        const rowElement = document.createElement("tr");

        Object.values(characterRow).forEach((cell) => {
          const cellElement = document.createElement("td");
          cellElement.textContent = cell;
          rowElement.appendChild(cellElement);
        });
        let { height, mass } = characterRow;
        let intMass = parseInt(mass);
        let intHeight = parseInt(height);
        let intMultiplier = parseInt(multiplierElement.value);

        // Initial character power calc
        let power =
          intMass && intHeight
            ? (intMass * intHeight * intMultiplier).toString()
            : "-";

        const cellElement = document.createElement("td");
        cellElement.textContent = power;
        rowElement.appendChild(cellElement);
        tableBody.appendChild(rowElement);
      });
    }
  }

  let cacheData = localStorage.getItem("tableCache");

  if (!cacheData) getFreshData("https://swapi.dev/api/people/");

  // Run the loadDataIntoTable function
  loadDataIntoTable(document.getElementById("table"));
}
