import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Verification from './Verification';

// Mock localStorage
const localStorageMock = (() => {
  let store = {
    verifiedEmail: 'test@example.com',
    token: 'mockToken'
  };
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Verification Component', () => {
  beforeEach(() => {
    jest.spyOn(localStorage, 'removeItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Verification form with email and verification code inputs', () => {
    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Verification Code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
  });

  test('fetches email from localStorage and disables email input', () => {
    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveValue('test@example.com');
    expect(emailInput).toBeDisabled();
  });

  test('handles successful verification', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'User verified successfully' }
    });

    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Verification Code/i), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('verifiedEmail');
      expect(toast.success).toHaveBeenCalledWith('User verified successfully');
    });
  });

  test('handles failed verification', async () => {
    axios.post.mockResolvedValue({
      data: { message: 'Verification failed' }
    });

    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Verification Code/i), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(toast.error)
    });
  });

  test('handles verification error', async () => {
    axios.post.mockRejectedValue(new Error('Failed to verify user'));

    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Verification Code/i), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(toast.error)
    });
  });

  test('validates email format', async () => {
    render(
      <MemoryRouter>
        <Verification />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Verify/i }));

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });
});
