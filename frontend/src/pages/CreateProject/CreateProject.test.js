import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProject from './CreateProject';

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('CreateProject component', () => {
  test('renders with required elements', () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <CreateProject />
      </MemoryRouter>
    );

    expect(getByText('Create New Project')).toBeInTheDocument();
    expect(getByLabelText('Name:')).toBeInTheDocument();
    expect(getByLabelText('Summary:')).toBeInTheDocument();
    expect(getByText('Is Public')).toBeInTheDocument();
    expect(getByText('Tags:')).toBeInTheDocument();
    expect(screen.getAllByText('Create Project').length).toBeGreaterThan(0);
  });

  test('allows user to enter project name', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <CreateProject />
      </MemoryRouter>
    );
    const nameInput = getByLabelText('Name:');
    
    fireEvent.change(nameInput, { target: { value: 'Test Project' } });

    expect(nameInput).toHaveValue('Test Project');
  });

  // Add more tests as needed
});
