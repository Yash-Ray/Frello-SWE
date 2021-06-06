import React from 'react'

import { makeStyles } from "@material-ui/core/styles";
import { Fade as fade } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({

    loader: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
    }
}))


const Loader = () => {

    const classes = useStyles();

    return (
        <div className={classes.loader}>
            <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '10px',
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CircularProgress />
            </div>

        </div>
    )
}

export default Loader
