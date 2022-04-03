import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import {styled} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';

import {formatAddress} from './utils/helpers';
import {injected} from './utils/connectors';

import {Web3Provider} from '@ethersproject/providers'
import {UserRejectedRequestError} from '@web3-react/injected-connector'
import {useWeb3React} from '@web3-react/core'

import { Web3ReactProvider } from '@web3-react/core'
import ETHBalance from './components/ETHBalance';
import ETHBalanceSWR from './components/ETHBalanceSWR';
import ReadERC20 from './components/ReadERC20';

const useStyles = makeStyles({
    button_connect: {
        margin: '20px !important'
    },
    container: {
        background: '#cee3f1',
        height: '100vh'
    },
    offset_2: {
        'margin-left': '16.67% !important'
    }
});

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const App = () => {
    const {chainId, account, activate, deactivate, setError, active, library, connector} = useWeb3React<Web3Provider>()

    const onClickConnect = () => {
        activate(injected, (error) => {
            if (error instanceof UserRejectedRequestError) {
                // ignore user rejected error
                console.log("user refused")
            } else {
                setError(error)
            }
        }, false)
    }

    const onClickDisconnect = () => {
        deactivate()
    }

    useEffect(() => {
        console.log(chainId, account, active, library, connector)
    })

    const classes = useStyles();

    return (
        <div className="App">
            <Container className={classes.container} maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {active && typeof account === 'string' ? (
                            <Button variant="contained" className={classes.button_connect}
                                    onClick={onClickDisconnect}>{formatAddress(account, 4)}</Button>
                        ) : (
                            <Button variant="contained" className={classes.button_connect}
                                    onClick={onClickConnect}>Connect Wallet</Button>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <ETHBalance></ETHBalance>
                    </Grid>
                    <Grid item xs={12}>
                        <ETHBalanceSWR></ETHBalanceSWR>
                    </Grid>
                    <Grid item xs={12}>
                        <ReadERC20 addressContract='0xb25cafd4b5FCBAE13Cb6d761dA4fdED3bA07008C'></ReadERC20>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
