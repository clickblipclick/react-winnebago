import InputWrapper from './InputWrapper';

class ArbitraryValidator extends InputWrapper {

  constructor(props) {
    super(props);
    this.validateFlag = false;
  }

  componentWillMount() { }

  getValue() {
    return this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.validateFlag = true;
    } else {
      this.validateFlag = false;
    }
  }

  componentDidUpdate() {
    if (this.validateFlag) {
      this.validateFlag = false;
      this.validateCurrentValue();
    }
  }

  focus() { }

  render() {
    return null;
  }

}

export default ArbitraryValidator;
