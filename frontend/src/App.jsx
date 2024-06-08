import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your components
import SignIn from './pages/SignInPage/SignIn';
import SignUp from './pages/SignUpPage/SignUp';
import CreateProject from './pages/CreateProject/CreateProject';
import CreateDataset from './pages/CreateDataset/CreateDataset';
import EditProjectForm from './pages/EditProject/EditProjectForm';
import ProjectDetailPage from './pages/ProjectDetails/ProjectDetailPage';
import About from './pages/Welcome/About';
import ProposalsPage from './pages/ProposalsPage/ProposalsPage';
import CreateProposal from './pages/CreateProposal/CreateProposal';
import UserProfile from './pages/UserProfile/UserProfile';
import EditProfile from './pages/EditProfile/EditProfile';
import Welcome from './pages/Welcome/Welcome';
import Verification from './pages/Verification/Verification';
import Explore from './pages/Explore/Explore';
import MyProjects from './pages/SharedProjects/MyProjects';
import ParticipatedProjects from './pages/ParticipatedProjects/ParticipatedProjects';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ContactUs from './pages/ContactUs/ContactUs';
import CollaboratorEditProjectForm from './pages/EditProject/CollaboratorEditProjectForm';

// ProtectedRoute component
const ProtectedRoute = ({ isAuthenticated, element, loading }) => {
  if (loading) {
    // Show loading spinner or placeholder
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated) {
    return element;
  }
  
  return <Navigate to="/sign-in" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication state on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false); // Set loading to false after checking authentication
  },);
  
  return (
    <div className='w-screen h-screen'>
      <Router>
        <ToastContainer position="bottom-left" />
        { !loading && (
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            
            <Route path='/sign-in' element={isAuthenticated ? <Navigate to="/explore" replace /> : <SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/verify' element={<Verification />} />
            <Route path='/welcome' element={<Welcome />} />
            <Route path='/about' element={<About isSignedIn={isAuthenticated}/>} />
            <Route path='/contact-us' element={<ContactUs isSignedIn={isAuthenticated}/>} />
            

            {/* Protected routes */}
            <Route path='/project/create' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<CreateProject />} loading={loading} />} />
            <Route path="/project/edit/:projectId" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<EditProjectForm />} loading={loading} />} />
            <Route path="/project/collaborator/edit/:projectId" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<CollaboratorEditProjectForm />} loading={loading} />} />
            <Route path="/project/detail/:projectId" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<ProjectDetailPage />} loading={loading} />} />
            <Route path="/dataset/create/:projectId" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<CreateDataset />} loading={loading} />} />
            <Route path="/proposals/:type" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<ProposalsPage />} loading={loading} />} />
            <Route path="/proposal/create/:projectId" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<CreateProposal />} loading={loading} />} />
            <Route path='/user-profile' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<UserProfile />} loading={loading} />} />
            <Route path='/edit-profile' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<EditProfile />} loading={loading} />} />
            <Route path='/explore' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Explore />} loading={loading} />} />
            <Route path='/my-projects' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<MyProjects />} loading={loading} />} />
            <Route path='/participated-projects' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<ParticipatedProjects />} loading={loading} />} />
            
            {/* Not Found Page */}
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
