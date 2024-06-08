import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react'; // Import 'act' from '@testing-library/react'
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';


jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Navbar Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  test('renders Vite logo', () => {
    const logoElement = screen.getByAltText(/Your Company/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    const navLinks = ['Explore', 'Data Access Proposals', 'Create Project', 'About', 'Contact Us'];
    navLinks.forEach((link) => {
      const navLinkElement = screen.getByRole('link', { name: link });
      expect(navLinkElement).toBeInTheDocument();
    });
  });

  test('renders profile dropdown menu', async () => {
    const profileButton = screen.getByRole('button', { name: /Open user menu/i });
    act(() => { // Wrap this part with act()
      fireEvent.click(profileButton);
    });

    const profileMenu = screen.getByRole('menu');
    const profileMenuItems = [
      'Your Profile',
      '(Co-)Owned Projects',
      'Projects Shared with Me',
      'Data Access Proposals',
      'Sign out',
    ];

    profileMenuItems.forEach((item) => {
      const menuItemElement = within(profileMenu).getByRole('menuitem', { name: item });
      expect(menuItemElement).toBeInTheDocument();
    });
  });

  test('sign out button works', () => {
    const profileButton = screen.getByRole('button', { name: /Open user menu/i });
    act(() => { // Wrap this part with act()
      fireEvent.click(profileButton);
    });

    const profileMenu = screen.getByRole('menu');
    const signOutButton = within(profileMenu).getByRole('menuitem', { name: /Sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});
