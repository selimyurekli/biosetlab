import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactUs from './ContactUs';

describe('ContactUs', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ContactUs isSignedIn={false} />
      </MemoryRouter>
    );
  });
});
