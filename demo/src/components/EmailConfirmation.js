import React, { Component } from "react";
import serialize from "form-serialize";

import Form, { InputWrapper, ErrorMessage } from "../../../src";

import { isRequired, isEmail, matches } from "../helpers/validation";
import SuccessMessage from "./SuccessMessage";

class EmailConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailConfirm: "",
      submitted: false
    };
  }
  render() {
    const { email, emailConfirm, submitted } = this.state;
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
        >
          <div className="form-field">
            <label>Email</label>
            <InputWrapper
              name="email"
              validate={[
                {
                  test: isRequired,
                  message: "Sorry, this field is required."
                },
                {
                  test: isEmail,
                  message: "Must be a valid email address."
                }
              ]}
            >
              <input
                name="email"
                type="email"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </InputWrapper>
            <ErrorMessage className="error-message" for="email" />
          </div>
          <div className="form-field">
            <label>Email Confirmation</label>
            <InputWrapper
              name="email-confirm"
              validate={[
                {
                  test: isRequired,
                  message: "Sorry, this field is required."
                },
                {
                  test: isEmail,
                  message: "Must be a valid email address."
                },
                {
                  test: matches,
                  message: "Email address must match above.",
                  params: [email]
                }
              ]}
            >
              <input
                name="email-confirm"
                type="email"
                value={emailConfirm}
                onChange={e => this.setState({ emailConfirm: e.target.value })}
              />
            </InputWrapper>
            <ErrorMessage className="error-message" for="email-confirm" />
          </div>
          <input type="submit" />
        </Form>;
  }
}

export default EmailConfirmation;
