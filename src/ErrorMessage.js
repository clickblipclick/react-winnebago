import React from 'react';
import PropTypes from 'prop-types';

class ErrorMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  componentDidMount() {
    this.context.registerMessage(this);
  }

  getElementProps() {
    const props = Object.assign({}, this.props);
    props.htmlFor = props.for;
    delete props.element;
    delete props.for;
    return props;
  }

  show(message) {
    this.setState({ isActive: true, message: message });
  }

  hide() {
    this.setState({ isActive: false });
  }

  render() {
    if (this.state.isActive) {
      return React.createElement(this.props.element, this.getElementProps(), this.state.message);
    } else {
      return null;
    }
  }

}

ErrorMessage.defaultProps = {
  element: 'label'
};

ErrorMessage.contextTypes = {
  registerMessage: PropTypes.func.isRequired
};

export default ErrorMessage;
