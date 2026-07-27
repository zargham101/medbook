import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar, Footer } from '@/components/Layout';
import { InstallPrompt } from '@/components/InstallPrompt';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { DoctorsDirectory } from '@/pages/DoctorsDirectory';
import { DoctorProfilePage } from '@/pages/DoctorProfilePage';
import { PatientDashboard } from '@/pages/PatientDashboard';
import { DoctorDashboard } from '@/pages/DoctorDashboard';
import { DoctorSetup } from '@/pages/DoctorSetup';
import { LoginPage, SignupPage } from '@/pages/AuthPages';
import { AboutUs } from '@/pages/AboutUs';
import { ContactUs } from '@/pages/ContactUs';
import { BlogPage } from '@/pages/BlogPage';

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <InstallPrompt />
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<BlogPage />} />
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
            <Route
              path="/doctor/setup"
              element={
                <ProtectedRoute role="DOCTOR">
                  <DoctorSetup />
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
