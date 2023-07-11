import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Container, Typography, FormControlLabel, Checkbox, Grid} from '@mui/material';

import API from '../../services/api';

import { fetchToken, setItem, removeToken, useAuth, useUser } from './Auth';


export default function Registration() {

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  let token = useAuth(); 
  let user = useUser();

  const register = async (event) => {
    
    
    if (event) {
      event.preventDefault();
    }
    try {
      const data = new FormData(event.currentTarget);
      if ((data.get("username") == "") & (data.get("password") == "")) {
        return;
      } 
   
      let response = await API.Registration({
        username: data.get("username"),
        password: data.get("password")
      });
      console.log(response)
      if (response.username) {
        //console.log(response.access_token)
        
        
        
        
        setError(null)
        navigate('/login')
      }
    } catch (e) {
      
      if (e.response){ 
        setError(e.response.data.detail);
      }
      else if (e.request) {
        setError(e.message)
      } else {
        setError(e.message)
      }
      navigate('/registration')
    }     
  };

  
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
          Sign Up
        </Typography>
        <Typography variant="subtitle2">
          {error}
        </Typography>
        <Box component="form" onSubmit={register} noValidate sx={{ mt: 1 }}>
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
            Sign Up
          </Button>
          
        </Box>
      </Box>
    </Container>
        )
      }
      </Box>
    
    
)
  }