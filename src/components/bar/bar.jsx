import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { fetchToken, removeToken, useAuth, useUser } from "../../views/auth/Auth";


export default function Bar(){
    const navigate = useNavigate()
    let token = useAuth(); 
    let user = useUser();
    const go_login = () => {
        navigate('/login')
    };

    const handleWise = () => {
        if (user.user.role == "superuser"){
            navigate("/admin/chat")
        } else {
            navigate("user/chat")
        }
    }

    const logout = () => {
        removeToken()
        token.setToken(null);
        user.setUser({})
        navigate('/login')
    }
    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Box mr={2}>
                    <ChatBubbleOutlineIcon />
                    </Box>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" onClick={handleWise}>Wise Chat</Button>
                </Typography>
                {
                fetchToken() ?
                (<Button color="inherit" onClick={logout}>Logout</Button>):
                (<Button color="inherit" onClick={go_login}>Login</Button>)
                }
                </Toolbar>
            </AppBar>
            </Box>
        </Fragment>
    )
}