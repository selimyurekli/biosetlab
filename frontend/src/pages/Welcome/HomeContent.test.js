import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeContent from './HomeContent';
import { MemoryRouter } from 'react-router-dom';

describe('HomeContent Component', () => {
  test('renders main heading', () => {
    render(
      <MemoryRouter>
        <HomeContent signedIn={false} />
      </MemoryRouter>
    );
    const headingElement = screen.getByText(/Empowering Healthcare Data Collaboration: Find, Share, Securely./i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders description paragraph', () => {
    render(
      <MemoryRouter>
        <HomeContent signedIn={false} />
      </MemoryRouter>
    );
    const paragraphElement = screen.getByText(/Join the movement towards revolutionizing healthcare collaboration!/i);
    expect(paragraphElement).toBeInTheDocument();
  });

  // Add more tests as needed to cover additional functionality
});
