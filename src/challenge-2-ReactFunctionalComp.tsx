import { useCallback, useEffect, useState } from "react";
import {
  calculatePower,
  Character,
  DEFAULT_FILTER_INPUT,
  DEFAULT_MULTIPLIER,
  fetchCharacters,
} from "./challenge-1-vanilla";

const FunctionalComp = () => {
  let [cacheData, setCacheData] = useState<string | null>(
    localStorage.getItem("tableData")
  );
  const [multiplier, setMultiplier] = useState<string>(DEFAULT_MULTIPLIER);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Error>();
  const [filterInput, setFilterInput] = useState<string>("");

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMultiplier(DEFAULT_MULTIPLIER);
      setFilterInput(DEFAULT_FILTER_INPUT);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    console.log(cacheData);
    let apiCallInProgress = localStorage.getItem("apiCallInProgress");
    if (!cacheData && apiCallInProgress === "false") {
      setLoading(true);
      fetchCharacters()
        .then((response) => {
          setLoading(false);
          setCacheData(response);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [localStorage.getItem("tableData")]);

  const characterTableInfo: Character[] = cacheData
    ? JSON.parse(cacheData).filter((character: Character) => {
        return character.name.toLowerCase().includes(filterInput);
      })
    : [];

  return (
    <div id="functional-comp">
      <h2>React Functional Component</h2>
      Filter:
      <input
        placeholder="Filter by name"
        value={filterInput}
        onChange={(event) => {
          setFilterInput(event.target.value);
        }}
      />{" "}
      Multiplier:{" "}
      <input
        placeholder="Multiplier"
        type="number"
        min="1"
        max="20"
        value={multiplier}
        onChange={(event) => {
          setMultiplier(event.target.value);
        }}
      />{" "}
      Press "Escape" to reset fields
      {loading && <div className="loader">Loading...</div>}
      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {characterTableInfo.map((character: Character) => {
            const { name, height, mass } = character;
            let power = calculatePower(height, mass, multiplier);
            return (
              <tr key={`${name}-${power}`}>
                <td>{name}</td>
                <td>{height}</td>
                <td>{mass}</td>
                <td>{power}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FunctionalComp;
