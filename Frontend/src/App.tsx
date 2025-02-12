import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import UserHome from './pages/UserHome';
import PrivateRoute from './routes/PrivateRoute';
import UserProfile from './components/UserProfile';
import ArticleForm from './components/ArticleForm';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element = {<LandingPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/register' element={<RegistrationPage/>}></Route>
          
          
          {/* Protect Routes */}
          <Route element = {<PrivateRoute/>}>
            <Route path='/home' element={<UserHome/>}/>
            <Route path = '/profile/:id' element = {<UserProfile/>}/>
            <Route path = '/publish' element = {<ArticleForm/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
