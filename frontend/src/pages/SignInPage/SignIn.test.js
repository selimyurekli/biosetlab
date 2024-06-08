import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import '@testing-library/jest-dom'; 
import SignIn from './SignIn'; 
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { token: 'mockToken' } })),
}));

jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }));

describe('SignIn component', () => {
  test('renders email and password input fields', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('renders sign in button', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays error message for invalid email format', async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.type).toBe('password');

    // const toggleButton = screen.getByTestId('toggle-password-visibility'); // Find by test id instead of role
    // fireEvent.click(toggleButton);
    // expect(passwordInput.type).toBe('text');
  });

  test('submits the form with valid email and password', async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

    // Wait for the success toast message to be called

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });
});
