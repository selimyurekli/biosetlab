import React from 'react';
import { render } from '@testing-library/react';
import ProposalDetails from './ProposalDetails';

test('renders proposal details with loading state', () => {
  const proposal = {
    applicatorId: 'applicantId',
    applicantUserIds: ['otherApplicantId1', 'otherApplicantId2'],
    verified: 'accept', // Change according to your test case
    proposalText: 'Proposal text',
    potentialResearchBenefits: 'Potential research benefits',
    proposalReviewText: 'Proposal review text',
  };
  const projectName = 'Test Project';

  // Mock localStorage.getItem
  const mockGetItem = jest.fn();
  global.localStorage.getItem = mockGetItem.mockReturnValue('fakeToken');

  const { getByText } = render(<ProposalDetails proposal={proposal} projectName={projectName} />);

  // Check if loading state is rendered initially
  const loadingMessage = getByText('Proposal Details');
  expect(loadingMessage).toBeInTheDocument();
});
