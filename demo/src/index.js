import React, { Component } from 'react'
import { render } from 'react-dom'

import Form, { InputWrapper, ErrorMessage } from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-winnebago Demo</h1>
      <Form onSubmit={(e) => console.log(e)}>
        <InputWrapper name="first-name" validate={[{
          test: (value) => { return (value && value !== ''); },
          message: 'Sorry, this field is required.'
        }]}>
          <input type="text" name="first-name" />
        </InputWrapper>
        <ErrorMessage for="first-name" />
        <input type="submit" />
      </Form>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
