import React, { Component , useState, useEffect, useRef} from 'react';
import { Box, Grid, TextField, Paper, Typography, Button, Avatar, Link} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
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
    const fileInput = useRef();
    const [messages, setMessages] = useState([]);
    const [newMessage, newMessageSet] = useState({});
    const [fileList, setFileList] = useState([]);
    const [files, setFiles] = useState([]);
    let user = useUser();
    let token = useAuth();
    
    const {state} = useLocation();
    const chat_id = state.params.chat_id;
    //console.log(chat_id)

    const handleSend = () => {
      //input.trim() !== ""
        if (1) {
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
                    if (files.length !== 0){
                      let formDataFiles = new FormData();
                      for (var i = 0; i < files.length; i++){
                            formDataFiles.append('files',files[i])
                      }
                      console.log(formDataFiles.get("files"))
                      console.log(formData.get("chat_id"))
                      let msg = input ? formData.get("message") : 'files'
                      const dat = await API.CreateMessageFiles(formDataFiles, {
                        chat_id: formData.get("chat_id"),
                        user_id: formData.get("user_id"),
                        message: msg,
                    }, token.token);
                    setFiles([]);
                    }
                    else {
                      const dat = await API.CreateMessage({
                        chat_id: formData.get("chat_id"),
                        user_id: formData.get("user_id"),
                        message: formData.get("message")
                    }, token.token);
                    }
                    
                    //console.log(dat.data)
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

    const handleFileChange = (e) => {
      if (e.target.files){
        setFileList(e.target.files);
        //console.log(e.target.files)
        const fs = e.target.files ? [...e.target.files] : [];
        //console.log(fs)
        setFiles(fs);
      }
      
      console.log(fileList)

    }
    const uploadFile = () => {
      fileInput.current.click();
    }

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
              //console.log(data.data.messages)
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
          <Message key={message.id} message={message} user_id={user.user} files={message.files}/>
        ))}
      </Box>
      <Box sx={{ p: 3, backgroundColor: "background.default" }}>
        <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={0.5}>
        
          <Grid item xs={8}>
    
            <TextField
            
              fullWidth
              size="small"
              placeholder="Type a message"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
            />
            {files.map((file, index) =>(

              <div key={index}>{`${file.name}`}</div>


            ))}

          </Grid>
          <Grid item xs>

          <input type="file" multiple style={{ "display": "none" }} ref={fileInput} onChange={handleFileChange} />   
          <Button fullWidth color="inherit" size="large"  onClick={uploadFile}>
          <AttachFileIcon></AttachFileIcon>
          
          </Button>      
     
          </Grid>
          <Grid item xs>

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

const Message = ({ message , user_id, files}) => {
  let token = useAuth();
  const messagesEndRef = useRef(null)
  //console.log(user_id)
    const isBot = 1 == message.user_id;
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const downloadFile = (file_id, filename) => (event) => {
      console.log(file_id, filename)
      let fetchData = async () => {
        const data = await API.DownloadFile(file_id, filename, token.token)
      }
      fetchData();
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
            backgroundColor: isBot ? "#F5F5F5" : "#F5F5F5",
            borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>
          {files.map((file) => (
           <Box sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
            <Link component="button" variant="body2" color="#2196F3" onClick={downloadFile(file.id, file.name)}>{file.name}</Link>
            </Box>
          ))}
          
          
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