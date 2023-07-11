import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Container, Typography, FormControlLabel, Checkbox, Grid} from '@mui/material';

import API from '../../services/api';

import { fetchToken, setItem, removeToken, useAuth, useUser, setItemUser } from './Auth';


export default function Login() {

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  let token = useAuth(); 
  let user = useUser();

  const login = async (event) => {
    
    
    if (event) {
      event.preventDefault();
    }
    try {
      const data = new FormData(event.currentTarget);
      if ((data.get("username") == "") & (data.get("password") == "")) {
        return;
      } 
      console.log('login')
      console.log({
        username: data.get("username"),
        password: data.get("password")
      })
      let response = await API.Login({
        username: data.get("username"),
        password: data.get("password")
      });
      console.log(response.access_token)
      if (response.access_token) {
        console.log(response.access_token)
        token.setToken(response.access_token)
        setItem(response.access_token)
        

        let me = await API.GetMe(response.access_token);
        console.log(me.data)
        user.setUser(me.data)
        setItemUser(me.data)
        //console.log(user.user)
        setError(null)
        if (me.data.role === "superuser"){
          navigate('/admin/chat')
        } else {
          navigate('/user/chat')
        }
        
      }
    } catch (e) {
      removeToken();
      token.setToken(null);
      user.setUser({})
      console.log(e)
      if (e.response){ 
        setError(e.response.data.detail);
      }
      else if (e.request) {
        setError(e.message)
      } else {
        setError(e.message)
      }
    }     
  };

  /*const login = () => {
    if (username=='' & password ==''){
      return
    } else { 
      axios.post('http://127.0.0.1:8002/login', {
        username: username,
        password: password
      })
      .then(function(response){
        console.log(response.data.token, 'response.data.token')
        if(response.data.token){
          setToken(response.data.token)
          navigate('/chat');
        }
      })
      .catch(function(error){
        console.log(error, 'error');
      })
    }
  }*/
  return(
    <Box sx={{ flexGrow: 1 }}>
      {
        fetchToken() ?
        (<div>
          <p>you are logged in</p>
          <Link to="/user/chat">Click to login</Link>
          </div>
          )
        :
        (
          <Container component="main" maxWidth="xs">
      <Box
        sx={{  
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            
            <Grid item>
              <Link to={'/registration'} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
        )
      }
      </Box>
    /*<div style={{minHeight:800, marginTop:30}}>
      <h1>login page</h1>
      <div style={{marginTop:30}}>
      {
        
        fetchToken()
         ?
         (
          <div>
          <p>you are logged in</p>
          <Link to="/chat">Click to login</Link>
          </div>
          ):
          (
           
            <div>

               <form>
                   <label style={{marginRight: 10 }}>Input Username</label>
                   <input type='text' onChange={(e)=>setUsername(e.target.value)}/>

                   <label style={{marginRight: 10 }}>Input Password</label>
                   <input type='text' onChange={(e)=>setPassword(e.target.value)}/>

                   <button type='button' onClick={login}>Login</button>   
               </form>

            </div>
        )
      }
      </div>
    </div>  */
    
)
  }