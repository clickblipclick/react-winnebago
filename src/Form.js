import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import set from "lodash/set";
import isArray from "lodash/isArray";
import forEach from "lodash/forEach";

function throwError(message) {
  throw new Error(message);
}

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.inputs = {};
  }

  getChildContext() {
    return {
      registerWrapper: component => this.registerWrapper(component),
      unregisterWrapper: component => this.unregisterWrapper(component),
      registerMessage: component => this.registerMessage(component),
      unregisterMessage: component => this.unregisterMessage(component),
      showMessage: name => this.showMessage(name),
      hideMessage: name => this.hideMessage(name),
      onValidate: (name, isValid, messageText) =>
        this.onValidate(name, isValid, messageText)
    };
  }

  showMessage(name, text) {
    if (this.inputs[name].message !== "undefined") {
      this.inputs[name].message.show(text);
    }
  }

  hideMessage(name) {
    if (this.inputs[name].message !== "undefined") {
      this.inputs[name].message.hide();
    }
  }

  onValidate(name, isValid, messageText) {
    if (!isValid) {
      this.showMessage(name, messageText);
    } else {
      this.hideMessage(name);
    }
  }

  registerWrapper(component) {
    if (typeof this.inputs[component.props.name] !== "undefined") {
      throwError(
        `There are multiple validation elements with the same name: ${component
          .props.name}`
      );
    }
    set(this.inputs, component.props.name + ".component", component);
  }

  unregisterWrapper(component) {
    delete this.inputs[component.props.name];
  }

  registerMessage(component) {
    if (
      typeof this.inputs[component.props.for] !== "undefined" &&
      typeof this.inputs[component.props.for].message !== "undefined"
    ) {
      throwError(
        `There are multiple message elements with the same name: ${component
          .props.for}`
      );
    }
    set(this.inputs, component.props.for + ".message", component);
  }

  unregisterMessage(component) {
    if (typeof this.inputs[component.props.name] !== "undefined") {
      delete this.inputs[component.props.name].message;
    }
  }

  validate() {
    const { onValidate } = this.props;
    const { inputs } = this;
    let formIsValid = true;
    let focusedOne = false;

    if (!arguments.length) {
      for (var input in inputs) {
        const component = inputs[input].component;
        if (typeof component !== "undefined") {
          if (!component.validate()) {
            if (!focusedOne) {
              component.focus();
              focusedOne = true;
            }
            if (formIsValid) {
              formIsValid = false;
            }
          }
        }
      }
    }

    if (arguments.length && typeof arguments[0] === "string") {
      const input = inputs[arguments[0]];
      if (typeof input === "undefined") {
        throwError(
          `"${arguments[0]}" is not a validation target on this form.`
        );
      }
      if (!input.component.validate()) {
        input.component.focus();
        formIsValid = false;
      }
    }

    if (arguments.length && isArray(arguments[0])) {
      forEach(arguments[0], inputName => {
        const input = inputs[inputName];
        if (typeof input === "undefined") {
          throwError(`"${inputName}" is not a validation target on this form.`);
        }
        if (!input.component.validate()) {
          if (!focusedOne) {
            input.component.focus();
            focusedOne = true;
          }
          if (formIsValid) {
            formIsValid = false;
          }
        }
      });
    }
    onValidate(formIsValid);
    return formIsValid;
  }

  validateInput(name) {
    return this.inputs[name].validate();
  }

  render() {
    const { onSubmit, onValidate, ...props } = this.props;

    return React.createElement(
      "form",
      Object.assign(
        {
          onSubmit: e => {
            if (this.validate()) {
              if (typeof onSubmit === "function") {
                onSubmit(e);
              }
            } else {
              e.preventDefault();
            }
          }
        },
        ...props
      )
    );
  }
}

Form.defaultProps = {
  onValidate: () => {}
};

Form.propTypes = {
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func
};

Form.childContextTypes = {
  registerWrapper: PropTypes.func.isRequired,
  unregisterWrapper: PropTypes.func.isRequired,
  registerMessage: PropTypes.func.isRequired,
  unregisterMessage: PropTypes.func.isRequired,
  hideMessage: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired
};

export default Form;
