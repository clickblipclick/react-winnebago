import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import set from 'lodash/set';
// import { set, forEach, assign, isArray } from 'lodash';

class Form extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { inputs: {} };
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
    this.state.inputs[name].message.hide();
  }

  onValidate(name, isValid, messageText) {
    console.log(name, isValid, messageText);
    let currentState = this.state;
    console.log(currentState.inputs);
    if (typeof currentState.inputs[name].message !== 'undefined') {
      currentState.inputs[name].message.show(messageText);
    }
  }

  storeInputWrapper(component) {
    if ((component._type !== 'radio' && component._type !== 'checkbox') || typeof React.Children.only(component.props.children).props.checked !== 'undefined') {
      let currentState = this.state;
      set(currentState.inputs, component.props.name + '.component', component);
      this.setState(currentState);
    }
  }

  removeInputWrapper(component) {
    if (component._type !== 'radio' && component._type !== 'checkbox') {
      let currentState = this.state;
      delete currentState.inputs[component.props.name];
      this.setState(currentState);
    }
  }

  storeMessage(component) {
    let currentState = this.state;
    set(currentState.inputs, component.props.for + '.message', component);
    console.log(currentState.inputs);
    this.setState(currentState);
  }

  validate() {
    const { inputs } = this.state;
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
        throw new Error('"' + arguments[0] + '" is not a validation target on this form.');
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
        e.preventDefault();
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
