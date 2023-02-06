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
export const parseCharacterData = (
  data: { results: any[] },
  characterTableInfo: Character[]
) => {
  data.results.forEach((character) => {
    const { name, height, mass } = character;
    characterTableInfo.push({
      name,
      height,
      mass,
    });
  });
};

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
const throwError = async () => {
  throw new Error(`Something went wrong with your api call.`);
};
//-------- FUNCTION FOR FETCHING CHARACTERS --------//
export const fetchCharacters = async () => {
  let tableData: string | null = localStorage.getItem("tableData");
  const characterTableInfo: Character[] = [];
  let nextPage = "https://swapi.dev/api/people/";
  if (!tableData) {
    while (nextPage) {
      const response = await fetch(nextPage);
      const data = await response.json();
      parseCharacterData(data, characterTableInfo);
      nextPage = data.next;
    }
    let returnVal = JSON.stringify(characterTableInfo);
    localStorage.setItem("tableData", returnVal);
    return returnVal;
  } else {
    return tableData;
  }
};

export const runVanillaApp: () => void = () => {
  const multiplierInput = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;
  const filterInput = document.getElementById("filter") as HTMLInputElement;

  // -------- CACHE DATA -------- //
  let cacheData: string | null;
  let characterTableInfo: Character[] = [];
  const tableBody = document.querySelector("#tbody");
  //localStorage.clear();
  let loader = document.getElementById("loader");

  fetchCharacters()
    .then((response) => {
      cacheData = response;
      loadDataIntoTable();
      if (loader) {
        loader.style.display = "none";
      }
    })
    .catch((error) => {
      console.log(error);
      throwError();
    });

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

  //-------- LOAD DATA INTO TABLE --------//
  const loadDataIntoTable = async () => {
    if (tableBody && cacheData) {
      characterTableInfo = JSON.parse(cacheData);
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

  //-------- Run the loadDataIntoTable function --------//
  loadDataIntoTable();
};
