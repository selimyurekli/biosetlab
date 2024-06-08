import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import ProjectDetailPage from './ProjectDetailPage';

describe('ProjectDetailPage component', () => {
  test('renders loading message if project is null', () => {
    const { getByText } = render(
      <Router>
        <ProjectDetailPage />
      </Router>
    );
    const loadingElement = getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });
});
