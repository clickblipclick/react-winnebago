import React, { Component } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import serialize from "form-serialize";
import some from "lodash/some";
import findIndex from "lodash/findIndex";

import Form, {
  InputWrapper,
  ErrorMessage,
  ArbitraryValidator
} from "../../../src";

import {
  isRequired,
  isInteger,
  isMaxLength,
  isMinLength
} from "../helpers/validation";

import SuccessMessage from "./SuccessMessage";

const TextInput = ({ name, label, value, onChange }) =>
  <div className="form-field">
    {label
      ? <label htmlFor={name}>
          {label}
        </label>
      : null}
    <InputWrapper
      name={name}
      validate={[
        {
          test: isRequired,
          message: "Sorry, this field is required."
        }
      ]}
    >
      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />
    </InputWrapper>
    <ErrorMessage className="error-message" for={name} />
  </div>;

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string
};

class BasicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: "",
      lName: "",
      age: "",
      about: "",
      likes: [
        { label: "Apples", name: "apples", checked: false },
        { label: "Oranges", name: "oranges", checked: false },
        { label: "Onions", name: "onions", checked: false }
      ],
      select: "",
      submitted: false
    };
  }

  onCheckboxChange(e) {
    const likeIndex = findIndex(this.state.likes, ["name", e.target.name]);
    this.setState({
      likes: update(this.state.likes, {
        [likeIndex]: { checked: { $set: e.target.checked } }
      })
    });
  }

  render() {
    const { fName, lName, age, about, likes, select, submitted } = this.state;
    return submitted
      ? <SuccessMessage
          data={submitted}
          onBackClick={() => this.setState({ submitted: false })}
        />
      : <Form
          onSubmit={e => {
            e.preventDefault();
            this.setState({
              submitted: JSON.stringify(
                serialize(e.target, { hash: true }),
                null,
                2
              )
            });
          }}
          onValidate={isValid => console.log("form isValid", isValid)}
        >
          <TextInput
            label="First Name"
            name="first-name"
            value={fName}
            onChange={e => this.setState({ fName: e.target.value })}
          />
          <TextInput
            label="Last Name"
            name="last-name"
            value={lName}
            onChange={e => this.setState({ lName: e.target.value })}
          />
          <div className="form-field">
            <label htmlFor="age">Age</label>
            <InputWrapper
              name="age"
              validate={[
                {
                  test: isInteger,
                  message: "Sorry, this field should be an integer."
                },
                {
                  test: isRequired,
                  message: "Sorry, this field is required."
                }
              ]}
            >
              <input
                id="age"
                type="number"
                name="age"
                value={age}
                onChange={e => this.setState({ age: e.target.value })}
              />
            </InputWrapper>
            <ErrorMessage className="error-message" for="age" />
          </div>
          <div className="form-field">
            <label htmlFor="about">About</label>
            <InputWrapper
              name="about"
              validate={[
                {
                  test: isMinLength,
                  message: "Sorry, must be longer than 10 characters.",
                  params: [10]
                },
                {
                  test: isMaxLength,
                  message: "Sorry, must be fewer than 100 characters.",
                  params: [100]
                }
              ]}
            >
              <textarea
                id="about"
                name="about"
                value={about}
                onChange={e => this.setState({ about: e.target.value })}
              />
            </InputWrapper>
            <ErrorMessage className="error-message" for="about" />
          </div>
          <div className="form-field">
            <label htmlFor="likes">I Like:</label>
            <div className="checkboxes">
              {likes.map(like =>
                <div className="checkbox" key={like.name}>
                  <label htmlFor={like.name}>
                    {like.label}
                  </label>
                  <input
                    id={like.name}
                    name={like.name}
                    type="checkbox"
                    checked={like.checked}
                    onChange={this.onCheckboxChange.bind(this)}
                  />
                </div>
              )}
            </div>
            <ArbitraryValidator
              name="likes"
              value={likes}
              validate={[
                {
                  test: value => some(value, "checked"),
                  message: "Please select at least one."
                }
              ]}
            />
            <ErrorMessage className="error-message" for="likes" />
          </div>
          <div className="form-field">
            <label htmlFor="select-box">Select One</label>
            <InputWrapper
              name="select-box"
              validate={[
                {
                  test: isRequired,
                  message: "Please make a selection"
                }
              ]}
            >
              <select
                id="select-box"
                value={select}
                onChange={e => this.setState({ select: e.target.value })}
              >
                <option value="" />
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
              </select>
            </InputWrapper>
            <ErrorMessage className="error-message" for="select-box" />
          </div>
          <input type="submit" value="Let's Go!" />
        </Form>;
  }
}

export default BasicForm;
