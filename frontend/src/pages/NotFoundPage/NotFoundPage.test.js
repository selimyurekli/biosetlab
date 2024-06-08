// NotFoundPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  test('renders 404 text', () => {
    render(<NotFoundPage />);
    const textElement = screen.getByText(/404/i);
    expect(textElement).toBeInTheDocument();
  });

  test('renders page not found text', () => {
    render(<NotFoundPage />);
    const textElement = screen.getByText(/Page not found/i);
    expect(textElement).toBeInTheDocument();
  });

  test('renders go back button with correct link', () => {
    render(<NotFoundPage />);
    const goBackButton = screen.getByText(/Go back/i);
    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).toHaveAttribute('href', '/welcome');
  });
});
