// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

type Character = {
  name: string;
  height: string;
  mass: string;
  power: string;
};

export function runVanillaApp() {
  // we need to get the value of the multiplier;
  let multiplierElement: HTMLInputElement = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;

  let multiplierVal = parseInt(multiplierElement.value);
  if (multiplierElement) {
    multiplierElement.addEventListener("input", updateValue);

    function updateValue(e: Event) {
      if (multiplierElement) {
        multiplierElement.value = (e.target as HTMLInputElement).value;
        multiplierVal = parseInt(multiplierElement.value)
        console.log("multiplierVal: ", multiplierVal)
      }
    }
  }
  // This function loads data into the table
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

          // Initial character power calc
          let characterPower =
            intMass && intHeight
              ? (intMass * intHeight * multiplierVal).toString()
              : "-";
          characterTableInfo.push({
            name,
            height,
            mass,
            power: characterPower,
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

      // Clear the existing table
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

  loadDataIntoTable(
    "https://swapi.dev/api/people/",
    document.getElementById("table")
  );
}
