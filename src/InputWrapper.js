import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
// import ReactDOM from 'react-dom';
// import { assign, defer, forEach, isFunction, isUndefined } from 'lodash';
// import validator from 'validator';
// import classNames from 'classnames';

class InputWrapper extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      validatedOnce: false,
      isValid: false
    };

    this.tests = {
      required: (value) => {
        return (value && value !== '');
      }
    };
  }

  componentWillMount() {
    this.storeOriginalProps();
  }

  componentDidMount() {
    this.context.registerWrapper(this);
  }

  componentWillUnmount() {
    if (!isUndefined(this.refs.input) && isFunction(this.refs.input.blur)) {
      this.refs.input.blur();
    }
    this.context.unregisterWrapper(this);
  }

  componentWillUpdate(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.context.hideMessage(this.props.name);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isValid !== this.state.isValid || !prevState.validatedOnce && this.state.validatedOnce) {
      this.props.onValidationStatusChange(this.state.isValid);
    }
  }

  storeOriginalProps() {
    const inputComponent = React.Children.only(this.props.children);
    for (var prop in inputComponent.props) {
      let newPropName = `_${prop}`
      this[newPropName] = inputComponent.props[prop];
    }
  }

  getValue() {
    // If you need to run validations on a different prop than 'value', you can set valueProp

    // If element is HTML node, access prop directly, otherwise assume it's a component, and go to props.
    if (this.refs.input instanceof Node) {
      return this.refs.input[this.props.valueProp];
    }
    return this.refs.input.props[this.props.valueProp];
  }

  validate() {
    const { validate, name } = this.props;
    // Assume this is valid.
    let isValid = true;
    let messageText = '';

    // Go through defined validations and execute them.
    for (var validation in validate) {
      const { test, params, message } = validate[validation];
      if (typeof test !== 'function') {
        throw new Error('Validation type does not exist.');
      } else {
        var argArray = [this.getValue()];

        if (params) {
          argArray = argArray.concat(params);
        }

        // if (typeof this.tests[validation.test] === 'function') {
        //   if (!this.tests[validation.test].apply(this, argArray)) {
        //     isValid = false;
        //     messageText = validation.message;
        //   }
        // }
        if (typeof test === 'function') {
          if (!test.apply(this, argArray)) {
            isValid = false;
            messageText = message;
          }
        }
      }
    }

    this.context.onValidate(name, isValid, messageText);

    this.setState({ validatedOnce: true, isValid: isValid });

    return isValid;
  }

  isCheckbox() {
    const inputComponent = React.Children.only(this.props.children);
    return (typeof inputComponent.props.checked === 'undefined');
  }

  validateCurrentValue() {
    if (this.state.validatedOnce || this.props.validateBeforeFirstBlur) {
      this.validate();
    }
  }

  focus() {
    if (isFunction(this.refs.input.focus)) {
      this.refs.input.focus();
    }
  }

  onBlur(e) {
    if (isFunction(this._onBlur)) { this._onBlur(e); }

    this.validateCurrentValue();
  }

  onFocus(e) {
    if (isFunction(this._onFocus)) { this._onFocus(e); }
  }

  onChange(e) {
    if (isFunction(this._onChange)) { this._onChange(e); }
    if (isFunction(this.context.onChange)) { this.context.onChange(e); }

    this.validateCurrentValue();
  }

  render() {
    const { invalidClassName } = this.props;
    const { isValid, validatedOnce } = this.state;

    // InputWrapper takes only one component
    const inputComponent = React.Children.only(this.props.children);

    const classNames = [inputComponent.props.className];

    if (!this.state.isValid && this.state.validatedOnce) {
      classNames.push(invalidClassName);
    }

    const props = {
      className: classNames.join(' '),
      ref: 'input',
      onBlur: this.onBlur.bind(this),
      onFocus: this.onFocus.bind(this),
      onChange: this.onChange.bind(this)
    };

    if ((inputComponent.props.type === 'radio' || inputComponent.props.type === 'checkbox') && this.isCheckbox()) {
      Object.assign(props, { checked: this.context.isChecked(inputComponent.props.value) })
    }

    const Child = React.cloneElement(inputComponent, props);

    return Child;
  }

}

InputWrapper.contextTypes = {
  registerWrapper: PropTypes.func.isRequired,
  unregisterWrapper: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  isChecked: PropTypes.func,
  hideMessage: PropTypes.func.isRequired
};

InputWrapper.defaultProps = {
  invalidClassName: 'invalid',
  validateBeforeFirstBlur: false,
  valueProp: 'value',
  onValidationStatusChange: function() {}
};

InputWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.shape({
    test: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    params: PropTypes.any,
    message: PropTypes.string
  })).isRequired,
  onValidationStatusChange: PropTypes.func.isRequired,
  valueProp: PropTypes.string.isRequired
}

export default InputWrapper;
