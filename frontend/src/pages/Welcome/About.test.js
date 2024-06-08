import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import About from './About';

test('renders About Our Project heading', () => {
  render(
    <MemoryRouter>
      <About isSignedIn={true} />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/About Our Project/i);
  expect(headingElement).toBeInTheDocument();
});
