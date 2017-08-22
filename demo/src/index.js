import React, { Component } from 'react'
import { render } from 'react-dom';
import update from 'immutability-helper';

import Form, { InputWrapper, ErrorMessage, ArbitraryValidator } from '../../src';
import { isRequired, isInteger, isMaxLength, isMinLength } from './helpers/validation';

import some from 'lodash/some';
import findIndex from 'lodash/findIndex';

const TextInput = ({ name, value, onChange }) => (
  <div>
    <label htmlFor={name}>First Name</label>
    <InputWrapper name={name} validate={[{
      test: isRequired,
      message: 'Sorry, this field is required.'
    }]}>
      <input id={name} type="text" name={name} value={value} onChange={onChange} />
    </InputWrapper>
    <ErrorMessage className="error-message" for={name} />
  </div>
);

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName: '',
      age: '',
      about: '',
      likes: [
        { label: 'Apples', name: 'apples', checked: false },
        { label: 'Oranges', name: 'oranges', checked: false },
        { label: 'Onions', name: 'onions', checked: false }
      ],
      select: ''
    };
  }

  onCheckboxChange(e) {
    const likeIndex = findIndex(this.state.likes, ['name', e.target.name]);
    this.setState({
      likes: update(this.state.likes, { [likeIndex]: { checked: { $set: e.target.checked } } })
    });
  }

  render() {
    const { fName, lName, age, about, likes, select } = this.state;
    return <div>
      <h1>Winnebago Demo</h1>
      <Form
        onSubmit={(e) => { console.log(e); e.preventDefault(); }}
        onValidate={() => { console.log('on validation fail') }}>
        <TextInput name="first-name" value={fName} onChange={(e) => this.setState({ fName: e.target.value })} />
        <TextInput name="last-name" value={lName} onChange={(e) => this.setState({ lName: e.target.value })} />
        <div>
          <label htmlFor="age">Age</label>
          <InputWrapper name="age" validate={[{
            test: isInteger,
            message: 'Sorry, this field should be an integer.'
          },{
            test: isRequired,
            message: 'Sorry, this field is required.'
          }]}>
            <input id="age" type="number" name="age" value={age} onChange={(e) => this.setState({ age: e.target.value })}  />
          </InputWrapper>
          <ErrorMessage className="error-message" for="age" />
        </div>
        <div>
          <label htmlFor="about">About</label>
          <InputWrapper name="about" validate={[{
            test: isMinLength,
            message: 'Sorry, must be longer than 10 characters.',
            params: [10]
          },{
            test: isMaxLength,
            message: 'Sorry, must be fewer than 100 characters.',
            params: [100]
          }]}>
            <textarea id="about" name="about" value={about} onChange={(e) => this.setState({ about: e.target.value })} />
          </InputWrapper>
          <ErrorMessage className="error-message" for="about" />
        </div>
        <div>
          <label htmlFor="likes">I Like:</label>
          {likes.map((like, index) => (
            <div key={like.name}>
              <label htmlFor={like.name}>{like.label}</label>
              <input
                id={like.name}
                name={like.name}
                type="checkbox"
                checked={like.checked}
                onChange={this.onCheckboxChange.bind(this)} />
            </div>
          ))}
          <ArbitraryValidator
            name="likes"
            value={likes}
            validate={[{
              test: (value) => some(value, 'checked'),
              message: 'Please select at least one.'
            }]} />
          <ErrorMessage className="error-message" for="likes" />
        </div>
        <div>
          <label htmlFor="select-box">Select One</label>
          <InputWrapper name="select-box" validate={[{
            test: isRequired,
            message: 'Please make a selection'
          }]}>
            <select id="select-box" value={select} onChange={(e) => this.setState({ select: e.target.value })}>
              <option value=""></option>
              <option value="one">One</option>
              <option value="two">Two</option>
              <option value="three">Three</option>
            </select>
          </InputWrapper>
          <ErrorMessage className="error-message" for="select-box" />
        </div>
        <input type="submit" value="Let's Go!" />
      </Form>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
