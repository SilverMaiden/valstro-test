import { Component } from "react";

class ClassComp extends Component {
  render() {
    return (
      <div id="class-comp">
        <h2>React Class Component</h2>
        Filter: <input placeholder="Filter by name" /> Multiplier:{" "}
        <input
          placeholder="Multiplier"
          type="number"
          min="1"
          max="20"
          defaultValue="10"
        />{" "}
        Press "Escape" to reset fields
        <div className="loader">Loading...</div>
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
            {/* This is just an example, please remove */}
            <tr>
              <td>Example Character (please remove)</td>
              <td>100</td>
              <td>50</td>
              <td>50000 (10 * 100 * 50)</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ClassComp;
