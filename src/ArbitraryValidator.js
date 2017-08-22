import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

class ArbitraryValidator extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      validatedOnce: false,
      isValid: false
    };
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

  componentDidUpdate() {
    if (this.validateFlag) {
      this.validateFlag = false;
      this.validateCurrentValue();
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
    return this.props.value;
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

  validateCurrentValue() {
    if (this.state.validatedOnce || this.props.validateBeforeFirstBlur) {
      this.validate( this.getValue() );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.validateFlag = true;
    } else {
      this.validateFlag = false;
    }
  }

  focus() { }

  render() {
    return null;
  }

}

ArbitraryValidator.contextTypes = {
  registerWrapper: PropTypes.func.isRequired,
  unregisterWrapper: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  isChecked: PropTypes.func,
  hideMessage: PropTypes.func.isRequired
};

ArbitraryValidator.defaultProps = {
  invalidClassName: 'invalid',
  validateBeforeFirstBlur: false,
  valueProp: 'value',
  onValidationStatusChange: function() {}
};

ArbitraryValidator.propTypes = {
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

export default ArbitraryValidator;
