import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar, Footer } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DoctorsDirectory } from '@/pages/DoctorsDirectory';
import { DoctorProfilePage } from '@/pages/DoctorProfilePage';
import { PatientDashboard } from '@/pages/PatientDashboard';
import { DoctorDashboard } from '@/pages/DoctorDashboard';
import { LoginPage, SignupPage } from '@/pages/AuthPages';

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/doctors" element={<DoctorsDirectory />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfilePage />} />
            <Route
              path="/patient"
              element={
                <ProtectedRoute role="PATIENT">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute role="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
