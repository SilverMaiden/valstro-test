// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

type Character = {
  name: string;
  height: string;
  mass: string;
  power: string;
};

export function runVanillaApp() {

  // Multiplier Element Logic
  let multiplierElement: HTMLInputElement = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;

    // Handler/Event listener for multiplierElement
    function handleMultiplierChange(e: Event) {
      if (multiplierElement) {
        multiplierElement.value = (e.target as HTMLInputElement).value;
      }
    }

    // Add event listener to multiplierElement
    if (multiplierElement) {
      multiplierElement.addEventListener("input", handleMultiplierChange);

  }


  // LOAD DATA INTO TABLE - This function loads data into the table
  async function loadDataIntoTable(url: string, table: HTMLElement | null) {
    const tableBody: HTMLTableSectionElement | null | undefined =
      table?.querySelector("tbody");
    if (tableBody) {
      // Initial fetch of data
      let characterTableInfo: Character[] = [];
      let response: Response = await fetch(url);
      let data = await response.json();

      const parseCharacterData = (data: { results: any[] }) => {
        data.results.forEach((character) => {
          let { name, height, mass } = character;
          let intMass = parseInt(mass);
          let intHeight = parseInt(height);
          let intMultiplier = parseInt(multiplierElement.value);

          // Initial character power calc
          let power =
            intMass && intHeight
              ? (intMass * intHeight * intMultiplier).toString()
              : "-";

          characterTableInfo.push({
            name,
            height,
            mass,
            power,
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

      // Clear the table of any existing data
      tableBody.innerHTML = "";

      characterTableInfo.forEach((characterRow: Character) => {
        const rowElement = document.createElement("tr");

        Object.values(characterRow).forEach((cell) => {
          const cellElement = document.createElement("td");
          cellElement.textContent = cell;
          rowElement.appendChild(cellElement);
        });
        tableBody.appendChild(rowElement);
      });
    }
  }

  // Run the loadDataIntoTable function
  loadDataIntoTable(
    "https://swapi.dev/api/people/",
    document.getElementById("table")
  );
}
