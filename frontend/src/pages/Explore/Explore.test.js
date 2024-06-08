import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Explore from './Explore';

// Mock the axios module
jest.mock('axios');

// Disable console.error and console.log
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  // Re-enable console.error and console.log after tests
  afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

const mockProjectData = {
    project: {
      name: "Test Project",
      description: "This is a test project",
      abstract: "Abstract of the test project",
      tagIds: [],
      userIds: [],
      datasetIds: [],
      ownerId: "owner123",
      updated_at: new Date().toISOString(),
    },
  };
  
  const mockTagData = [
    { _id: "tag1", name: "Tag 1" },
    { _id: "tag2", name: "Tag 2" },
  ];
  
  const mockUserNameInfo = {
    userNameInfo: {
      name: "John",
      surname: "Doe",
    },
  };

describe('EditProjectForm', () => {
    beforeEach(() => {
      // Mock the axios.post and axios.get calls
      axios.post.mockResolvedValueOnce({ data: mockProjectData });
      axios.get.mockResolvedValueOnce({ status: 200, data: mockTagData });
      axios.get.mockResolvedValueOnce({ status: 200, data: mockUserNameInfo });
      
      // Mock localStorage.getItem to return a token
      jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mockToken');
    });
  
    test('renders without crashing and displays the project name', async () => {
      render(
        <BrowserRouter>
          <Explore />
        </BrowserRouter>
      );
  
      // Ensure loading text is present initially
      expect(screen.getByText(/Explore Projects/i)).toBeInTheDocument();
    });
  });
  