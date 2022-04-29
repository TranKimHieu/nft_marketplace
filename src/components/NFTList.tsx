import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";
// import { DataHexstring }from "@ethersproject/bytes"

import useSWR from 'swr'
import { MARKETPLACE as abi } from "../abi/MARKETPLACE"
import { NFT as abiNft } from "../abi/NFT"
import { ethers } from 'ethers';
import { Button, Grid } from '@mui/material';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';
import config from '../utils/config';

interface Props {
  addressContract: string
}

const fetcher = (library: Web3Provider | undefined, abi: any) => (...args: any) => {
  if (!library) return

  const [arg1, arg2, ...params] = args
  const address = arg1
  const method = arg2
  const contract = new Contract(address, abi, library)

  return contract[method]()
}

export default function NFTList(props: Props) {
  const addressContract = props.addressContract
  const [items, setItems] = useState<Array<any>>([])
  const [totalSupply, setTotalSupply] = useState<string>()

  const { account, active, library } = useWeb3React<Web3Provider>()

  const { data: balance, mutate } = useSWR([addressContract, 'totalItemsForSale', account], {
    fetcher: fetcher(library, abi),
  })

  useEffect(() => {
    if (!(active && account && library)) return;
    // const contract = new Contract(addressContract, abi, library)
    // console.log(',,,,,,,,,,,,,,,,,,,,', contract)
    // contract.totalItemsForSale(0).then((res:any) => {
    //     console.log(',,,,,,,,,,,,,dasd,,,,,,,', res)
    // })
    //called only when changed to active
    fetchNft()
  }, [active])

  useEffect(() => {
    fetchNft()
  }, [])

  const fetchTransaction =  () => {
    let provider = new ethers.providers.EtherscanProvider('rinkeby');
    if (active && account && provider) {
      // provider.getBlockWithTransactions(7590074).then((transactions) => {
      //   console.log(transactions);
      //   // transactions.forEach((trans) => {
      //     // if(trans.to == config.ADDRESS_MARKETPLACE) {
      //       // console.log(trans);
      //     // }
      //   // })
      // });

      provider.getBlockNumber().then((transactions) => {
        console.log(transactions);
        // transactions.forEach((trans) => {
          // if(trans.to == config.ADDRESS_MARKETPLACE) {
            // console.log(trans);
          // }
        // })
      });
    }
  }

  const fetchNft = async () => {
    const contract = new Contract(addressContract, abi, library)
    const res = await contract.listItemsForSale()

    const itemsBuffer = [...res]
    await res.map(async (obj: any, index: any) => {
      const contractNft = new Contract(config.ADDRESS_NFT, abiNft, library)
      const response = await contractNft.tokenURI(obj.tokenId)

      itemsBuffer[index] = { ...itemsBuffer[index], ...{ uri: response } }

    })
    console.log('->>>>>>>.', itemsBuffer);
    setItems(itemsBuffer)
  }


  const buyNft = (index: any) => {
    if (!(active && account && library)) return
    const signer = new Contract(addressContract, abi, library.getSigner())

    const fromMe = signer.buyItem(items[index].id, { value: ethers.utils.parseEther(items[index].price.toString()) });

    // signer.on(fromMe, (from, to, amount, event) => {
    //     console.log('Transfer|sent', { from, to, amount, event })
    //     mutate(undefined, true)
    // })
  }

  // useEffect(() => {
  //     if(!(active && account && library)) return

  //     const erc20:Contract = new Contract(addressContract, abi, library)

  //     // listen for changes on an Ethereum address
  //     console.log(`listening for Transfer...`)

  //     const fromMe = erc20.filters.Transfer(account, null)
  //     erc20.on(fromMe, (from, to, amount, event) => {
  //         console.log('Transfer|sent', { from, to, amount, event })
  //         mutate(undefined, true)
  //     })

  //     const toMe = erc20.filters.Transfer(null, account)
  //     erc20.on(toMe, (from, to, amount, event) => {
  //         console.log('Transfer|received', { from, to, amount, event })
  //         mutate(undefined, true)
  //     })

  //     // remove listener when the component is unmounted
  //     return () => {
  //         erc20.removeAllListeners(toMe)
  //         erc20.removeAllListeners(fromMe)
  //     }

  //     // trigger the effect only on component mount
  //   }, [active,account])


  return (
    <div>
      <div >
        {items.map((obj: any, index) =>
        (<Grid xs={4}><Card sx={{ minWidth: 275 }}>
           <Button
              onClick={() => {
                fetchTransaction()
              }
              }>
              Test
            </Button>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              ID: {obj.id.toString()}
            </Typography>
            <Typography variant="h5" component="div">
              Price: {obj.price.toString()} ETH
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {/* {obj.address.toString()} */}
            </Typography>
            <Typography variant="body2">
              Token Id: {obj.tokenId.toString()}
              <br />
              <ImageListItem key={index}>
                <img
                  style={{ maxWidth: "200px" }}
                  src={obj.uri}
                  loading="lazy"
                />
              </ImageListItem>
            </Typography>
          </CardContent>
          {!obj.isSold ? (<CardActions>
            <Button
              onClick={() => {
                buyNft(index)
              }
              }>
              Buy
            </Button>
          </CardActions>) : ''}
        </Card>
        </Grid>))}
      </div>
    </div>
  )
}
