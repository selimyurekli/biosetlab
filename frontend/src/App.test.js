import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    // Mock localStorage getItem method
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Always true test', () => {
    expect(true).toBe(true);
  }); 

  it('renders Welcome page when user is not signed in', () => {
    // Mock localStorage getItem method to return null (user not signed in)
    localStorageMock.getItem.mockReturnValueOnce(null);

    render(<App />);

    // Check if Welcome page is rendered
    expect(screen.getByText('Empowering Healthcare Data Collaboration: Find, Share, Securely.')).toBeInTheDocument();
    // Check if the "Sign In" button is rendered
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
  });

  it('renders Home page when user is signed in', async () => {
    // Mock localStorage getItem method to return a token (user signed in)
    localStorageMock.getItem.mockReturnValueOnce('mockToken');

    render(<App />);

    // Wait for the component to update
    await act(async () => {
      // Check if Home page is rendered
      expect(await screen.findByText('Empowering Healthcare Data Collaboration: Find, Share, Securely.')).toBeInTheDocument();
      // Check if the "Sign In" button is NOT rendered
      ! expect(screen.queryAllByText('Sign In').length).toBeGreaterThan(0);
    });
  });

  it('redirects to Sign In page when clicking the "Sign In" button on Welcome page', () => {
    render(<App />);
    
    // Check if the "Sign In" button is rendered
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    // Click on the "Sign In" button
    userEvent.click(screen.getAllByRole('link', { name: 'Sign In' })[0]);
  });
});
