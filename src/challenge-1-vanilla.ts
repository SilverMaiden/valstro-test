// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

// Using interface over type, so as to have the option to extend it.
export interface Character {
  name: string;
  height: string;
  mass: string;
}

export const POWER_CELL_INDEX = 3;
export const DEFAULT_MULTIPLIER = "10";
export const DEFAULT_FILTER_INPUT = "";

//-------- Function TO PARSE THE DATA WE NEED --------//
// The api response comes with a lot of unneeded data - this function
// keeps only the data to be displayed, inline with the Character interface
// defined above.
const parseCharacterData = (data: { results: any[] }) => {
  let parsedData: Character[] = [];
  data.results.forEach((character) => {
    const { name, height, mass } = character;
    parsedData.push({
      name,
      height,
      mass,
    });
  });
  return parsedData;
};

// Function to calculate character power - it parses the string values
// within the function
export const calculatePower: (
  height: string,
  mass: string,
  multiplier: string
) => string = (height, mass, multiplier) => {
  const intHeight = parseInt(height);
  const intMass = parseInt(mass);
  const intMultiplier = parseInt(multiplier);
  const power =
    intHeight && intMass && intMultiplier
      ? (intHeight * intMass * intMultiplier).toString()
      : "-";
  return power;
};
//-------- FUNCTION FOR FETCHING CHARACTERS --------//

export let fetchCharacters = (() => {
  let cache: Promise<Character[]> | null = null;
  let loader = document.getElementById("loader");

  return async () => {
    if (cache) {
      return cache;
    }
    let results: Character[] = [];
    let nextUrl = "https://swapi.dev/api/people/";
    while (nextUrl) {
      if (loader && loader.style.display !== "none") {
        loader.style.display = "";
      }
      const response = await fetch(nextUrl);
      const data = await response.json();
      const parsedData = parseCharacterData(data);
      results = results.concat(parsedData);
      nextUrl = data.next;
    }
    cache = Promise.resolve(results);
    if (loader) {
      loader.style.display = "none";
    }

    return cache;
  };
})();

export const runVanillaApp: () => void = () => {
  const multiplierInput = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;
  const filterInput = document.getElementById("filter") as HTMLInputElement;

  // -------- CACHE DATA -------- //
  let characterTableInfo: Character[] = [];
  const tableBody = document.querySelector("#tbody");

  //-------- MULTIPLIER CHANGE HANDLER --------//
  multiplierInput.addEventListener("input", () => {
    characterTableInfo.forEach((character: Character, index: number) => {
      const power = calculatePower(
        character.height,
        character.mass,
        multiplierInput.value
      );
      (
        tableBody?.children[index].children[POWER_CELL_INDEX] as HTMLElement
      ).innerText = power;
    });
  });

  //-------- Filter the table's list by the name field --------//
  filterInput.addEventListener("input", () => {
    const filterValue = filterInput.value.toLowerCase();
    for (let i = 0; i < characterTableInfo.length; i++) {
      const row = tableBody?.children[i] as HTMLElement;
      if (characterTableInfo[i].name.toLowerCase().includes(filterValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });

  //--------- KEYDOWN EVENT LISTENER --------//
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      filterInput.value = DEFAULT_FILTER_INPUT;
      multiplierInput.value = DEFAULT_MULTIPLIER;
      for (let i = 0; i < characterTableInfo.length; i++) {
        const row = tableBody?.children[i] as HTMLElement;
        row.style.display = "";
        const power = calculatePower(
          characterTableInfo[i].height,
          characterTableInfo[i].mass,
          multiplierInput.value
        );
        (row.children[POWER_CELL_INDEX] as HTMLElement).innerText = power;
      }
    }
  });

  async function getCharacters() {
    characterTableInfo = await fetchCharacters();
    return characterTableInfo;
  }
  //-------- LOAD DATA INTO TABLE --------//
  const loadDataIntoTable = async () => {
    let characterTableInfo = await getCharacters();
    if (tableBody && characterTableInfo) {
      tableBody.innerHTML = "";

      characterTableInfo.forEach((characterRow: Character) => {
        const { name, height, mass } = characterRow;
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const heightCell = document.createElement("td");
        const massCell = document.createElement("td");
        const powerCell = document.createElement("td");

        nameCell.innerText = name;
        heightCell.innerText = height;
        massCell.innerText = mass;
        powerCell.innerText = calculatePower(
          height,
          mass,
          multiplierInput.value
        );

        row.appendChild(nameCell);
        row.appendChild(heightCell);
        row.appendChild(massCell);
        row.appendChild(powerCell);

        tableBody.appendChild(row);
      });
    }
  };

  // To clear cache and test full functionality again after the initial
  // app load, uncomment the line below.
  //localStorage.clear();
  loadDataIntoTable();
};
