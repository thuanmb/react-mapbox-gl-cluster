jest.mock("mapbox-gl");

import React from "react";
import ReactDOM from "react-dom";
import { ReactMapboxGlCluster } from "./modules";
import { data } from "./data";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ReactMapboxGlCluster data={data} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
