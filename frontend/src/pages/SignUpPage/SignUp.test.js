import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import '@testing-library/jest-dom'; 
import SignUp from './SignUp'; 
import axios from 'axios'; 
import { toast } from 'react-toastify';

jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url === 'http://localhost:8000/api/institution/get') {
      return Promise.resolve({ 
        status: 200, 
        data: [{ _id: '1', name: 'Institution 1' }, { _id: '2', name: 'Institution 2' }] 
      });
    }
  }),
  post: jest.fn((url, data) => {
    if (url === 'http://localhost:8000/api/user/signup') {
      if (data.email === 'existingemail@example.com') {
        return Promise.reject(new Error('User already exists'));
      } else {
        return Promise.resolve({ status: 200 });
      }
    }
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('SignUp component', () => {
  test('renders form fields', async () => {
    await act(async () => {
      render(
        <Router>
          <SignUp />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Surname')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
      expect(screen.getByLabelText('Institution')).toBeInTheDocument();
      expect(screen.getByLabelText('Address')).toBeInTheDocument();
    });
  });

  test('displays error message for invalid email format', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  test('displays error message if passwords do not match', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    // will be completed.
  });
  

  test('displays error message if user already exists', async () => {
    // will be completed.
});
});
