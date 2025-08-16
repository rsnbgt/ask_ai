import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Route,Routes } from "react-router";
import HomePage from './routes/HomePage.jsx';
import RootLayout from './layouts/RootLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ChatPage from './routes/ChatPage.jsx';
import Dashboard from './routes/Dashboard.jsx';
import SigninPage from './routes/SigninPage.jsx';
import SignupPage from './routes/SignupPage.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<RootLayout/>}>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/sign-in/*" element={<SigninPage/>} />
        <Route path='/sign-up/*' element={<SignupPage/>} />
        <Route path='dashboard' element={<DashboardLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='chats/:id' element={<ChatPage/>}/>
        </Route>
        
      </Route>
    </Routes>
  </BrowserRouter>,
)
