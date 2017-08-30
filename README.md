# React Winnebago

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A React form validation library.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

## Basic Example

```jsx
import Form, { InputWrapper, ErrorMessage } from 'react-winnebago';

<Form onSubmit={() => console.log("Called when form is valid.")} onValidate={() => console.log("Called when validation is run.")}>
  <InputWrapper name="name" validate={[{
      test: (value) => (value && value !==''),
      message: "Sorry, this field is required."
    }, {
      test: (value) => (value.length >= 3),
      message: "Sorry, name must be at least 3 characters."
    }
  ]}>
    <input name="name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
  </InputWrapper>
  <ErrorMessage for="name" />
  <input type="submit" value="Submit" />
</Form>
```

For advanced usage, please see the demos.

## Install

`npm install --save react-winnebago`

## Running the Demos

```sh
git clone https://github.com/clickblipclick/react-winnebago.git
cd react-winnebago
npm install
npm start
```

Then go to [http://localhost:3000/](http://localhost:3000/) to try them out.

## How does this library work?

This library seeks to simplify the common use case of having individual HTML form elements with various validation rules,
as well as an overall form in which all elements must be valid in order to submit. The basic way it works is as follows:

1. A `<Form />` element essentially returns a `<form />` while overwriting the `onSubmit` prop, to ensure the function passed there is only called if all child elements validate properly.
2. The `<Form />` element accepts any kind of child(ren) elements.
3. `<InputWrapper />` can wrap any `<input />`, `<textarea />`, or `<select />` element. It "registers" itself with the parent `<Form />` element using context. This element requires two props, a unique `name` (string) and `validate`, which takes an array of validation objects.
4. `<ArbitraryValidator />` is a component that can be used if you don't have a specific `<input />` element you want to wrap, but would still like to prevent form submission in some case. I find this useful for checkboxes and radio buttons. It takes the same props as `<InputWrapper />`.

### Validation Object

A validation object consists of the following keys:

- `test`: A validation function that takes the value of the field as the first argument, and returns true or false.
- `message`: The message that should be displayed if the element is invalid.
- `params`?: (Optional) An array of values that are passed as arguments to the validation function in the order they are in the array.

## API

Exports:
- `Form`
- `InputWrapper`
- `ArbitraryValidator`
- `ErrorMessage`

---

### &lt;Form />

#### Usage

```jsx
<Form className="my-class" onSubmit={() => console.log("Called when form is valid.")} onValidate={() => console.log("Called when validation is run.")}>
  {/* Form content here */}
</Form>
```

#### Props

##### - onSubmit: () => {}

Required. This function is called when all validation passes.

##### - onValidate?: (isValid) => {}

Optional. This runs every time the form validation is run with the first argument being a boolean describing whether the form is valid.

All other props are passed to a `<form />` element.

### &lt;InputWrapper />

#### Usage

```jsx
<InputWrapper
  name="name"
  validate={[
    {
      test: (value) => (value && value !== ''),
      message: "This field is required"
    }
  ]}
  invalidClassName="form-element--invalid">
  <input name="name" value={this.state.value} onChange={(e) => this.setState({ value: e.target.value })} />
</InputWrapper>
```

#### Props

##### - name: string

Required. Must be a unique name within the `<Form />`.

##### - validate: array

Required. An array of Validation Objects, eg. `[{ test: (value) => { return true; }, message: "Always valid!" }]`

##### - children: children

Required. A single child, likely `<input />`, `<textarea />`, or `<select />`.

##### - invalidClassName: string

Optional. A string that is appended to the className of the child input element if validation fails.

##### - validateBeforeFirstBlur: boolean

Optional. If true, the element will validate as soon as it changes the first time.

##### - onValidationStatusChange: (isValid) => {}

Optional. When the state of the child input changes from valid to invalid or vice-versa, this function is called.

### &lt;ArbitraryValidator />

#### Usage

```jsx
<ArbitraryValidator
  name="name"
  validate={[
    {
      test: (value) => (value && value !== ''),
      message: "This field is required"
    }
  ]}
  value={this.state.value} />
```

#### Props

##### - name: string

Required. Must be a unique name within the `<Form />`.

##### - validate: array

Required. An array of Validation Objects, eg. `[{ test: (value) => { return true; }, message: "Always valid!" }]`

##### - value: any

Required. This prop is evaluated with your validation functions.

##### - validateBeforeFirstBlur: boolean

Optional. If true, the element will validate as soon as it changes the first time.

##### - onValidationStatusChange: (isValid) => {}

Optional. When the state of the child input changes from valid to invalid or vice-versa, this function is called.


### &lt;ErrorMessage />

#### Usage

```jsx
<ErrorMessage
  for="name"
  element="span"
  />
```

#### Props

##### - for: string

Required. Must match the name of an `<InputWrapper />` or `<ArbitraryValidator />`.

##### - element: string

Optional. Can change the element used from the default `<label />` to `<div />`, `<label />`, `<span />`, `<aside />`, or `<section />`.

---

## FAQ

- Why is this called Winnebago?

Well... React validation -> RV -> Winnebago.

