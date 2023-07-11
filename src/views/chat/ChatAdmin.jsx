import React, { Component , useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import API from '../../services/api';
import { useAuth, useUser } from '../auth/Auth';
import { ChatModel } from '../../model/ChatModel';

export default function ChatAdmin() {
  const navigate = useNavigate()
  const [chats, setChats] = useState([]);
  const [time, setTime] = useState(Date.now());
  let user = useUser();
  let token = useAuth();
  

  const handleChatClick = (params) => (event) => {
    //console.log(params)
    navigate("/admin/chat/messages", { state: { params } })
  }

  useEffect(() => {
    let fetchData = async () => {
      
      try {
        if (user.user.id === undefined){
          let me = await API.GetMe(token.token);
          console.log(me.data)
          user.setUser(me.data)
          console.log(user)
          
        } else {
          const data = await API.ChatGetAdmin(user.user.id, token.token);
          setChats(data.data);
        }
        
      } catch(e){
        console.log(user.user)
        let me = await API.GetMe(token.token);
        console.log(token.token)
        user.setUser(me.data)
      }
    }
    
    const interval = setInterval(() => fetchData(), 1000);
    return () => {
      
      clearInterval(interval);
    };
  }, []);
  const listChats = chats.map((user, index) => 
  <React.Fragment>
    <ListItem key={index}>
    <ListItemButton alignItems="flex-start" onClick={handleChatClick({chat_id: user.id})}>
      <ListItemAvatar>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.user.username[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText
          primary={user.user.username}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {user.last_message.username}
              </Typography>
              {` - ${user.last_message.message.substring(0, 50)}...`}
            </React.Fragment>
          }
        />
      
      
    </ListItemButton>
    
    </ListItem>
    <Divider  variant="inset" component="li" />
    </React.Fragment>
  );
    return (
      <Container component="main" maxWidth="m">
        <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Chat
        </Typography>
        <List sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper' }}>
              {listChats}
            </List>
        
      </Box>
        </Container>
    );
  }