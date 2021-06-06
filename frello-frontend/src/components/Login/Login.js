import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Fade as fade } from "@material-ui/core";
import { Button, IconButton } from "@material-ui/core";
import { auth, provider } from "../../utils/Firebase"
import axios from "../../utils/Axios"
import io from 'socket.io-client'

import { useStateValue } from '../../utils/Redux/StateProvider'
import { actionTypes } from '../../utils/Redux/Reducer'




const clientSocket = io('https://trello-clone-2021.herokuapp.com/');


const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://wallpaperaccess.com/full/660790.jpg)',
        backgroundSize: 'cover'

    },
    loginBox: {
        fontFamily: 'Arial',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '260px',
        width: '260px',
        padding: theme.spacing(8),
        borderRadius: '8px'
    },
    btn: {
        backgroundColor: '#00bb7d',
        color: 'white',
        padding: theme.spacing(1, 1, 1, 1),
        marginTop: theme.spacing(4),
        fontSize: '14px',
        '&:hover': {
            backgroundColor: "#00bb8e"
        }
    },
    image: {
        width: '160px',
        height: '160px',
        marginBottom: theme.spacing(4)
    }

}))



const Login = ({ setUser, setBg }) => {

    clientSocket.on('connect', () => {
        console.log('Client connected.');
    });

    const [{ }, dispatch] = useStateValue();
    const [details, setDetails] = useState()
    const [data, setData] = useState({});
    const [registered, setRegistered] = useState(true)
    const classes = useStyles();
    const defaultUrl = "https://i.pinimg.com/originals/47/0a/19/470a19a36904fe200610cc1f41eb00d9.jpg"

    


    const signIn = () => {
        auth.signInWithPopup(provider)
            .then(res => {

                let email = res.user.email;

                axios.get(`/user/${email}`)
                    .then(response => {
                        if (email === response.data.email) {

                            const userData = {
                                _id: response.data._id,
                                name: response.data.name,
                                email: response.data.email,
                                photo: res.user.photoURL,
                                oldBG: response.data.background
                            }

                            setBg(userData.oldBG)

                            dispatch({
                                type: actionTypes.SET_USER,
                                user: userData,
                            })
                            setUser(userData)
                        }


                        else {
                            const dataObject = {
                                name: res.user.displayName,
                                email: res.user.email,
                                lists: [],
                                background: defaultUrl,
                                photo: res.user.photoURL
                            }
                            setData(dataObject);
                            setRegistered(false)
                        }
                    })
            })
            .catch((error) => alert(error.message))
    }

    const handleContinue = () => {

        axios.post("/upload/user", data);
        console.log("Uploaded user....no socket io")
        clientSocket.once('user-signed', (userData) => {
            dispatch({
                type: actionTypes.SET_USER,
                user: userData,
            })
            setBg(userData.oldBG)
            setUser(userData)
        })

        
    }

    return (
        <div className={classes.root}>

            <div className={classes.loginBox}>
                <img src="https://github.com/Yash-Ray/Mail_Script/blob/main/frelloN.png?raw=true" alt=""
                    className={classes.image} />
                <h2 style={{ color: 'white' }}>Welcome to Frello</h2>

                {registered ? (
                    <Button style={{ color: 'white' }}  className={classes.btn}
                        onClick={signIn}>
                        <h3>Sign-In with Google</h3>
                    </Button>
                ) : (
                        <Button className={classes.btn}
                            onClick={handleContinue}>
                            Let's Start
                        </Button>
                    )}

            </div>
        </div>
    )
}

export default Login
