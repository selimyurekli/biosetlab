import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Welcome from './Welcome';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Welcome Component', () => {
  test('renders WelcomeNavbar and HomeContent components', () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    // Check if WelcomeNavbar is rendered
    expect(screen.getByText(/Empowering Healthcare Data Collaboration/i)).toBeInTheDocument();

    // Check if HomeContent is rendered
    expect(screen.getByText(/Join the movement towards revolutionizing healthcare collaboration!/i)).toBeInTheDocument();
  });

  test('redirects to explore page if token is present in localStorage', () => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'mockToken');

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/explore');
  });

  test('does not redirect if token is not present in localStorage', () => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
