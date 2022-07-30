import React, { useEffect, useState } from 'react'
import axios from 'axios'

// https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT

export default function CurrencyConvert(props) {
  const [price, setPrice] = useState()

  useEffect(() => {
    getUSDTprice()
  }, [])

  const getUSDTprice = async () => {
    try {
      var response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${
          props.coin + props.to
        }`,
      )
      setPrice(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {price && (
        <p className={props.className}>
          ${(price['price'] * parseFloat(props.value)).toFixed(2)}
        </p>
      )}
    </>
  )
}

CurrencyConvert.defaultProps = {
  value: 1,
  coin: 'BNB',
  to: 'USDT',
  className: '',
}
