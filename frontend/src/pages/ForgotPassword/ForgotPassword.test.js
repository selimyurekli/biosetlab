import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mock axios requests
import { toast } from 'react-toastify';
import ForgotPassword from './ForgotPassword';
import { MemoryRouter } from 'react-router-dom';

// Mock the axios module to simulate successful and failed requests
jest.mock('axios');
jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }));

describe('ForgotPassword Component', () => {
  test('renders Forgot Password form', () => {
    const { getByText, getByLabelText } = render(
    <MemoryRouter>
        <ForgotPassword />
    </MemoryRouter>
    );
    const emailInput = getByLabelText('Email');
    const sendResetCodeButton = getByText('Send Reset Code');
    expect(emailInput).toBeInTheDocument();
    expect(sendResetCodeButton).toBeInTheDocument();
  });

  test('sends reset code on form submission', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    const emailInput = getByLabelText('Email');
    const sendResetCodeButton = getByText('Send Reset Code');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(sendResetCodeButton);
  
    // Mocking axios post request
    axios.post.mockResolvedValueOnce({ status: 200 });
  
    // Use waitFor to ensure the assertion happens after the response is processed
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/user/forgot-password',
        { email: 'test@example.com' }
      );
      expect(toast.success);
    });
  });
  
  test('displays error message on failed reset code sending', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    const emailInput = getByLabelText('Email');
    const sendResetCodeButton = getByText('Send Reset Code');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(sendResetCodeButton);
  
    // Mocking axios post request
    axios.post.mockRejectedValueOnce(new Error('Failed to send reset code'));
  
    // Use waitFor to ensure the error message is rendered after the failed request
    await waitFor(() => {
      expect(toast.error)
    });
  });
});

