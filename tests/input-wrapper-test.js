import expect from 'expect';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {render, unmountComponentAtNode} from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import Form, { InputWrapper } from 'src/'

describe('An <InputWrapper>', () => {
  const node = document.createElement('div');

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('when it has no children', () => {
    it('throws an error', () => {
      expect(() => {
        render(
          <Form onSubmit={() => {}}><InputWrapper name="test" validate={[]} ></InputWrapper></Form>, node
        )
      }).toThrow()
    })
  });

  describe('when it has more than one child', () => {
    it('throws an error', () => {
      expect(() => {
        render(
          <Form onSubmit={() => {}}>
            <InputWrapper name="test" validate={[]} >
              <input type="text" />
              <input type="text" />
            </InputWrapper>
          </Form>, node
        )
      }).toThrow()
    })
  });

  describe('when it has one child', () => {
    it('does not throw an error', () => {
      expect(() => {
        render(
          <Form onSubmit={() => {}}>
            <InputWrapper name="test" validate={[]}>
              <input type="text" />
            </InputWrapper>
          </Form>, node
        )
      }).toNotThrow()
    })
  });

  describe('when form is submitted', () => {
    it('it runs validation function');

    it('if one validation returns false, the element is marked invalid');
  });

})
