import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PrivateRoute from './utils/PrivateRoute';

import { AuthProvider } from './context/AuthContext';

import Contacts from './components/contacts/Index';
import Create from './components/contacts/Create';
import Edit from './components/contacts/Edit';

import LoginPage from './pages/LoginPage';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="main">
          <div>
            <h1 className="main-header">V-Contacts App</h1>
          </div>
          <div>
            <Routes>
              <Route exact path='/' element={<PrivateRoute/>}>
                <Route exact path="/" element={<Contacts/>} />
                <Route path='/create' element={<Create/>} />
                <Route path='/edit/:id?' component={<Edit />} />
              </Route>
              <Route path='/login' element={<LoginPage/>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
