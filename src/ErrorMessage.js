import React, { Component } from "react";
import PropTypes from "prop-types";

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  componentDidMount() {
    this.context.registerMessage(this);
  }

  componentWillUnmount() {
    this.context.unregisterMessage(this);
  }

  getElementProps() {
    const props = Object.assign({}, this.props);
    if (props.element === "label") {
      props.htmlFor = props.for;
    }
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
      return React.createElement(
        this.props.element,
        this.getElementProps(),
        this.state.message
      );
    } else {
      return null;
    }
  }
}

ErrorMessage.defaultProps = {
  element: "label"
};

ErrorMessage.propTypes = {
  element: PropTypes.oneOf(["div", "label", "span", "aside", "section"])
};

ErrorMessage.contextTypes = {
  registerMessage: PropTypes.func.isRequired,
  unregisterMessage: PropTypes.func.isRequired
};

export default ErrorMessage;
