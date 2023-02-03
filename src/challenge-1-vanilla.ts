// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

type Character = {
  name: string;
  height: string;
  mass: string;
};

export const runVanillaApp = () => {
  //-------- Function TO PARSE THE DATA WE NEED --------//
  const parseCharacterData = (
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

  const calculatePower = (height: string, mass: string) => {
    const intHeight = parseInt(height);
    const intMass = parseInt(mass);
    const power =
      intHeight && intMass
        ? (intHeight * intMass * parseInt(multiplierInput.value)).toString()
        : "-";
    return power;
  };

  //-------- FUNCTION FOR FETCHING CHARACTERS --------//
  const fetchCharacters = async () => {
    const characterTableInfo: Character[] = [];
    let nextPage = "https://swapi.dev/api/people/";

    while (nextPage) {
      const response = await fetch(nextPage);
      const data = await response.json();
      parseCharacterData(data, characterTableInfo);
      nextPage = data.next;
    }
    localStorage.setItem("tableData", JSON.stringify(characterTableInfo));
  };

  const multiplierInput = document.getElementById(
    "multiplier"
  ) as HTMLInputElement;
  const filterInput = document.getElementById("filter") as HTMLInputElement;

  // -------- CACHE DATA -------- //
  const cacheData: string | null = localStorage.getItem("tableData");
  const tableBody = document.querySelector("#tbody");
  if (!cacheData) {
    fetchCharacters();
  } else {
    const characterTableInfo = JSON.parse(cacheData);

    //-------- MULTIPLIER CHANGE HANDLER --------//
    multiplierInput.addEventListener("input", () => {
      characterTableInfo.forEach((character: Character, index: number) => {
        const power = calculatePower(character.height, character.mass);
        (tableBody?.children[index].children[3] as HTMLElement).innerText =
          power;
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
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        filterInput.value = "";
        multiplierInput.value = "10";
        for (let i = 0; i < characterTableInfo.length; i++) {
          const row = tableBody?.children[i] as HTMLElement;
          row.style.display = "";
          const power = calculatePower(
            characterTableInfo[i].height,
            characterTableInfo[i].mass
          );
          (row.children[3] as HTMLElement).innerText = power;
        }
      }
    });

    //-------- LOAD DATA INTO TABLE --------//
    const loadDataIntoTable = async () => {
      if (tableBody && cacheData) {
        const characterTableInfo = JSON.parse(cacheData);
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
          powerCell.innerText = calculatePower(height, mass);

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
  }
}
