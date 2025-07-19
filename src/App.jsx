import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Ciclos from './pages/Ciclos';
import Sintomas from './pages/Sintomas';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/ciclos" element={
          <ProtectedRoute>
            <Ciclos />
          </ProtectedRoute>
        } />
        <Route path="/sintomas" element={
          <ProtectedRoute>
            <Sintomas />
          </ProtectedRoute>
        } />
        {/* Rota coringa para erros/404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 