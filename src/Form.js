import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import set from 'lodash/set';

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
      registerWrapper: (component) => { this.storeInputWrapper(component); },
      unregisterWrapper: (component) => { this.removeInputWrapper(component); },
      registerMessage: (component) => this.storeMessage(component),
      hideMessage: (name) => { this.hideMessage(name); },
      onValidate: (name, isValid, messageText) => { this.onValidate(name, isValid, messageText); }
    };
  }

  hideMessage(name) {
    this.inputs[name].message.hide();
  }

  onValidate(name, isValid, messageText) {
    if (typeof this.inputs[name].message !== 'undefined') {
      this.inputs[name].message.show(messageText);
    }
  }

  storeInputWrapper(component) {
    if ((component._type !== 'radio' && component._type !== 'checkbox') || typeof React.Children.only(component.props.children).props.checked !== 'undefined') {
      if (typeof this.inputs[component.props.name] !== 'undefined') {
        throwError(`There are multiple validation elements with the same name: ${component.props.name}`);
      }
      set(this.inputs, component.props.name + '.component', component);
    }
  }

  removeInputWrapper(component) {
    if (component._type !== 'radio' && component._type !== 'checkbox') {
      delete this.inputs[component.props.name];
    }
  }

  storeMessage(component) {
    if (typeof this.inputs[component.props.for] !== 'undefined' && typeof this.inputs[component.props.for].message !== 'undefined') {
      throwError(`There are multiple message elements with the same name: ${component.props.for}`);
    }
    set(this.inputs, component.props.for + '.message', component);
  }

  validate() {
    const { inputs } = this;
    let formIsValid = true,
      focusedOne = false;

    if (!arguments.length) {
      for (var input in inputs) {
        const component = inputs[input].component;
        if (typeof component !== 'undefined') {
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

    if (arguments.length && typeof arguments[0] === 'string') {
      const input = inputs[arguments[0]];
      if (typeof input === 'undefined') {
        throw new Error(`"${arguments[0]}" is not a validation target on this form.`);
      }
      if (!input.component.validate()) {
        input.component.focus();
        formIsValid = false;
      }
    }

    if (arguments.length && isArray(arguments[0])) {
      forEach(arguments[0], (inputName) => {
        const input = inputs[inputName];
        if (typeof input === 'undefined') {
          throw new Error('"' + inputName + '" is not a validation target on this form.');
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

    return formIsValid;
  }

  getProps() {
    return Object.assign({}, this.props, {
      onSubmit: (e) => {
        if (!this.validate()) {
          e.preventDefault();
        }
        if (this.validate()) {
          this.props.onSubmit(e);
        }
      }
    });
  }

  render() {
    return React.createElement('form', this.getProps());
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

Form.childContextTypes = {
  registerWrapper: PropTypes.func.isRequired,
  unregisterWrapper: PropTypes.func.isRequired,
  registerMessage: PropTypes.func.isRequired,
  hideMessage: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired
};

export default Form;
