import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';

class InputWrapper extends Component {

  constructor(props) {
    super(props);

    this.state = {
      validatedOnce: false,
      isValid: false
    };
  }

  componentWillMount() {
    this.storeOriginalProps();
  }

  componentDidMount() {
    this.context.registerWrapper(this);
  }

  componentWillUnmount() {
    if (typeof this.refs.input !== 'undefined' && isFunction(this.refs.input.blur)) {
      this.refs.input.blur();
    }
    this.context.unregisterWrapper(this);
  }

  componentWillUpdate(nextProps) {
    const { name } = this.props;
    if (name !== nextProps.name) {
      this.context.hideMessage(name);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isValid, validatedOnce } = this.state;
    if (prevState.isValid !== isValid || !prevState.validatedOnce && validatedOnce) {
      this.props.onValidationStatusChange(isValid);
    }
  }

  storeOriginalProps() {
    const inputComponent = Children.only(this.props.children);
    for (var prop in inputComponent.props) {
      let newPropName = `_${prop}`
      this[newPropName] = inputComponent.props[prop];
    }
  }

  getValue() {
    const { valueProp, children } = this.props;
    const { input } = this.refs;
    // If you need to run validations on a different prop than 'value', you can set valueProp
    return Children.only(children).props[valueProp];
  }

  validate(value) {
    const { validate, name } = this.props;
    // Assume this is valid.
    let isValid = true;
    let messageText = '';
    // If undefined use current value
    const val = (typeof value !== 'undefined') ? value : this.getValue();

    // Go through defined validations and execute them.
    for (var validation in validate) {
      const { test, params, message } = validate[validation];
      if (typeof test !== 'function') {
        throw new Error('Validation type does not exist.');
      } else {
        var argArray = [val];

        if (params) {
          argArray = argArray.concat(params);
        }

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
    const inputComponent = Children.only(this.props.children);
    return (typeof inputComponent.props.checked === 'undefined');
  }

  validateValue(value) {
    if (this.state.validatedOnce || this.props.validateBeforeFirstBlur) {
      this.validate( value );
    }
  }

  validateCurrentValue() {
    if (this.state.validatedOnce || this.props.validateBeforeFirstBlur) {
      this.validate( this.getValue() );
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

    this.validateValue( e.target.value );
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
      onChange: this.onChange.bind(this),
    };

    if ((inputComponent.props.type === 'radio' || inputComponent.props.type === 'checkbox') && this.isCheckbox()) {
      Object.assign(props, { checked: this.context.isChecked(inputComponent.props.value) })
    }

    return React.cloneElement(inputComponent, props);
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
  valueProp: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export default InputWrapper;
