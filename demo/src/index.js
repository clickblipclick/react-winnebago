import React, { Component } from 'react'
import { render } from 'react-dom';
import update from 'immutability-helper';

import Form, { InputWrapper, ErrorMessage, ArbitraryValidator } from '../../src';
import { isRequired, isInteger, isMaxLength, isMinLength } from './helpers/validation';

import some from 'lodash/some';
import findIndex from 'lodash/findIndex';

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
      ]
    };
  }

  onCheckboxChange(e) {
    const likeIndex = findIndex(this.state.likes, ['name', e.target.name]);
    this.setState({
      likes: update(this.state.likes, { [likeIndex]: { checked: { $set: e.target.checked } } })
    });
  }

  render() {
    const { fName, lName, age, about, likes } = this.state;
    return <div>
      <h1>Winnebago Demo</h1>
      <Form onSubmit={(e) => { e.preventDefault(); }}>
        <div>
          <label htmlFor="first-name">First Name</label>
          <InputWrapper name="first-name" validate={[{
            test: isRequired,
            message: 'Sorry, this field is required.'
          }]}>
            <input id="first-name" type="text" name="first-name" value={fName} onChange={(e) => this.setState({ fName: e.target.value })} />
          </InputWrapper>
          <ErrorMessage element="div" className="error-message" for="first-name" />
        </div>
        <div>
          <label htmlFor="last-name">Last Name</label>
          <InputWrapper name="last-name" validate={[{
            test: isRequired,
            message: 'Sorry, this field is required.'
          }]}>
            <input id="last-name" type="text" name="last-name" value={lName} onChange={(e) => this.setState({ lName: e.target.value })}  />
          </InputWrapper>
          <ErrorMessage className="error-message" for="last-name" />
        </div>
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
              test: (value) => {
                console.log(some(value, 'checked'));
                return some(value, 'checked');
              },
              message: 'Please select at least one.'
            }]} />
          <ErrorMessage className="error-message" for="likes" />
        </div>
        <input type="submit" value="Let's Go!" />
      </Form>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
