import expect from 'expect';
import React from 'react';
import PropTypes from 'prop-types';
import {render, unmountComponentAtNode} from 'react-dom';

import Form from 'src/'

describe('A <Form>', () => {
  const node = document.createElement('div');

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('when it has multiple children', () => {
    it('does not throw an error', () => {
      expect(() => {
        render(
          <Form onSubmit={() => {}}>
            <p>Foo</p>
            <p>Bar</p>
          </Form>, node
        )
      }).toNotThrow()
    })
  });

  describe('when it has no children', () => {
    it('does not throw an error', () => {
      expect(() => {
        render(
          <Form onSubmit={() => {}}></Form>, node
        )
      }).toNotThrow()
    })
  });

  describe('context', () => {
    let rootContext;
    const ContextChecker = (props, context) => {
      rootContext = context;
      return null;
    }

    ContextChecker.contextTypes = {
      registerWrapper: PropTypes.func.isRequired,
      unregisterWrapper: PropTypes.func.isRequired,
      registerMessage: PropTypes.func.isRequired,
      hideMessage: PropTypes.func.isRequired,
      onValidate: PropTypes.func.isRequired
    };

    afterEach(() => {
      rootContext = undefined;
    })

    it('correct functions are added to context', () => {
      render(
        <Form onSubmit={() => {}}>
          <ContextChecker />
        </Form>, node
      );

      expect(rootContext.registerWrapper).toBeA('function');
      expect(rootContext.unregisterWrapper).toBeA('function');
      expect(rootContext.registerMessage).toBeA('function');
      expect(rootContext.hideMessage).toBeA('function');
      expect(rootContext.onValidate).toBeA('function');
    });
  })

})
