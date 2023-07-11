import React, { Component, useEffect } from 'react';
import {Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import Login from './views/auth/Login';
import Registration from './views/auth/Registration';
import ChatAdmin from './views/chat/ChatAdmin';
import ChatUser from './views/chat/ChatUser';
import Error from './views/error/Error';
import { AuthContext } from './contexts/AuthContext';
import { TokenContext } from './contexts/TokenContext';

import { AuthProvider, RequireAdmin, RequireAuth, UserProvider, fetchToken , RequireUser, fetchUser} from './views/auth/Auth';
import Bar from './components/bar/bar';
import ChatMessage from './views/chatMessage/chatMessage';

export default function App() {
  let token = fetchToken();
  let user = fetchUser();

  useEffect(() => {
    document.title = "WISE+";
  }, []);
  
  return (
      <React.StrictMode>
      <BrowserRouter>
      
      <AuthProvider tokenData={token}>
                <UserProvider userData={user}>
                
                <Bar />
              <Routes>
                  <Route 
                    path='/login/*' 
                    element={<Login/>} />
                  <Route 
                    path='/registration/*' 
                    element={<Registration/>} />
                  <Route 
                    path='/admin/chat/*' 
                    element={
                      <RequireAuth>
                        <RequireAdmin>
                          <ChatAdmin/>
                        </RequireAdmin>
                      </RequireAuth>
                      
                      } />

                  <Route 
                    path='/admin/chat/messages/*' 
                    element={
                      <RequireAuth>
                        <RequireAdmin>
                        <ChatMessage />
                        </RequireAdmin>
                      </RequireAuth>
                      
                      } />
                  <Route 
                    path='/user/chat/*' 
                    element={
                      <RequireAuth>
                        <RequireUser>
                          <ChatUser/>
                        </RequireUser>
                      </RequireAuth>
                      
                      } />
                  <Route 
                    path='/user/chat/messages/*' 
                    element={
                      <RequireAuth>
                        <RequireUser>
                          <ChatMessage />
                        </RequireUser>
                      </RequireAuth>
                      
                      } />
                  <Route path='/error/*' element={<Error/>} />
                  
                  <Route path="/" element={<Navigate to="/user/chat" replace />}/>
              </Routes>
              </UserProvider>
              </AuthProvider>

      </BrowserRouter>
  </React.StrictMode> 
  );
}
