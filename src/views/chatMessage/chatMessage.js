import React, { Component , useState, useEffect, useRef} from 'react';
import { Box, Grid, TextField, Paper, Typography, Button, Avatar} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser, removeToken } from '../auth/Auth';
import API from '../../services/api';

const messages = [
    { id: 1, text: "Hi there!", sender: "bot" },
    { id: 2, text: "Hello!", sender: "user" },
    { id: 3, text: "How can I assist you today?", sender: "bot" },
  ];

export default function ChatMessage(){
  const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, newMessageSet] = useState({});
    let user = useUser();
    let token = useAuth();
    
    const {state} = useLocation();
    const chat_id = state.params.chat_id;
    //console.log(chat_id)

    const handleSend = () => {
        if (input.trim() !== "") {
            newMessageSet()
            let fetchData = async () => {
          
                try {
                    console.log(user.user.id)
                    console.log({
                        chat_id: chat_id,
                        user_id: parseInt(user.user.id),
                        message: input
                    })
                    let formData = new FormData();
                        formData.append('chat_id', chat_id);
                        formData.append('user_id', parseInt(user.user.id));
                        formData.append('message', input);
                    const dat = await API.CreateMessage({
                        chat_id: formData.get("chat_id"),
                        user_id: formData.get("user_id"),
                        message: formData.get("message")
                    }, token.token);
                    console.log(dat.data)
                    //setMessages(data.data.messages)
                    //console.log(messages)
                    //setChats(data.data);
                  
                  
                } catch(e){
                  console.log(e)
                }
              }
              fetchData();
          //console.log(data);
          //console.log(chat_id);
          //console.log(user.user.id)
          setInput("");
        }
      };

    const handleInputChange = (event) => {
        setInput(event.target.value);
      };

      useEffect(() => {
        let fetchData = async () => {
          
          try {
            if (user.user.id === undefined){
              let me = await API.GetMe(token.token);
              //console.log(me.data)
              user.setUser(me.data)
              //console.log(user)
              
            } else {
              const data = await API.ChatGet(chat_id, token.token);
              //console.log(user.user.id)
              setMessages(data.data.messages)
              //console.log(messages)
              //setChats(data.data);
            }
            
          } catch(e){
            console.log(e.response.status)
            if (e.response.status == 401){
              removeToken()
              token.setToken(null);
              user.setUser({})
              navigate('/login')
            }
            //let me = await API.GetMe(token.token);
            //console.log(token.token)
            //user.setUser(me.data)
          }
        }
        
        const interval = setInterval(() => fetchData(), 1000);
        return () => {
          
          clearInterval(interval);
        };
      }, [messages]);


    return (
        <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {messages.map((message) => (
          <Message key={message.id} message={message} user_id={user.user} />
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              //endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
    )

}

const Message = ({ message , user_id}) => {

  const messagesEndRef = useRef(null)
  //console.log(user_id)
    const isBot = 1 == message.user_id;
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
      scrollToBottom()
    }, [messages]);
  
  
    return (
      <Box
        sx={{
          display: "flex",
          mb: 2,
          flexDirection: isBot ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: isBot ? "primary.main" : "secondary.main" }}>
          {user_id.role == "superuser" ? (isBot ? "W" : "U"):(isBot ? "W" : user_id.username[0].toUpperCase())}
          
        </Avatar>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isBot ? 1 : 0,
            mr: isBot ? 0 : 1,
            backgroundColor: isBot ? "primary.light" : "secondary.light",
            borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>
        </Paper>
        <div ref={messagesEndRef} />
      </Box>
    );
  };
/*{user_chats === 1 ? 
    (
        <List sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper' }}>
        {listChats}
        </List>
    ) 
    : 
    (
        <Box
            sx={{
                //height: "50vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "grey.200",
            }}
            >
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                    size="small"
                    fullWidth
                    placeholder="Type a message"
                    variant="outlined"
                    value={'wfewefwef'}
                    //onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    //endIcon={<SendIcon />}
                    //onClick={handleSend}
                    >
                    Send
                    </Button>
                </Grid>
                </Grid>
            </Box>
        </Box>
    )}*/