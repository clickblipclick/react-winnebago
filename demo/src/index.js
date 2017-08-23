import "normalize.css";
import "./styles/index.css";

import React, { Component } from "react";
import { render } from "react-dom";

// Examples
import BasicForm from "./components/BasicForm";
import EmailConfirmation from "./components/EmailConfirmation";

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>Winnebago Demo</h1>
        <h2>Basic Form Validation</h2>
        <BasicForm />
        <hr />
        <h2>Email Confirmation</h2>
        <EmailConfirmation />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
