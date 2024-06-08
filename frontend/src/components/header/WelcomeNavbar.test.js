import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter as Router
import WelcomeNavbar from './WelcomeNavbar';

describe('WelcomeNavbar Component', () => {
  test('renders navigation links', () => {
    const { getByText } = render(
      <Router>
        <WelcomeNavbar />
      </Router>
    );

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText('Contact Us')).toBeInTheDocument();
    expect(getByText('Sign In')).toBeInTheDocument();
  });

  test('changes current navigation item on click', () => {
    const { getByText } = render(
      <Router>
        <WelcomeNavbar />
      </Router>
    );

    const aboutLink = getByText('About');
    fireEvent.click(aboutLink);
    expect(aboutLink).toHaveClass('bg-gray-900 text-white');
    expect(getByText('Home')).not.toHaveClass('bg-gray-900 text-white');
    expect(getByText('Contact Us')).not.toHaveClass('bg-gray-900 text-white');
  });

  // Additional tests can be added as needed
});
