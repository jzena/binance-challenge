//https://www.binance.com/api/v3/depth?symbol=BTCUSDT&limit=1000

import React, {useState} from 'react'
import useWebSocket from 'react-use-websocket'
import CurrentOrderLevel from '../components/CurrentOrder'
import Footer from '../components/Footer'
import Header from '../components/Header/Header'
import PriceLevelRow from '../components/PriceLevelRow'
import Search from '../components/Search'
import TitleRow from '../components/TitleRow'
import TopSearch from '../components/TopSearch'
import {formatNumber, formatPrice} from '../utils'

const options: any = {
  PI_XBTUSD: [0.5, 1, 2.5],
  PI_ETHUSD: [0.05, 0.1, 0.25],
}
const WSS_FEED_URL: string = 'wss://stream.binance.com:9443/stream'

export type OrderBookItem = {
  total: number
  size: number
  price: number
  isBuyer: boolean
  pairCurrenty: string
}

export default function OrderBook() {
  const [currencyPair, setcurrencyPair] = useState('btcusd')
  const [ordersBuyer, setOrdersBuyer] = useState<OrderBookItem[]>([])
  const [ordersSeller, setOrdersSeller] = useState<OrderBookItem[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderBookItem | undefined>()
  const [previousOrder, setPreviousOrder] = useState<
    OrderBookItem | undefined
  >()

  // socket connection
  const {sendMessage} = useWebSocket(WSS_FEED_URL, {
    onOpen: () => {
      console.log('WebSocket connection opened.')
    },
    onClose: () => {
      console.log('WebSocket connection closed.')
      unSubscribeTrade(currencyPair)
    },
    shouldReconnect: closeEvent => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  })

  // handlers
  const subscribeTrade = (currencyPair: string) => {
    if (currencyPair) {
      const subscribe = {
        method: 'SUBSCRIBE',
        params: [`${currencyPair.toLowerCase()}t@aggTrade`],
        id: 1,
      }
      sendMessage(JSON.stringify(subscribe))
    }
  }

  const unSubscribeTrade = (currencyPair: string) => {
    if (currencyPair) {
      const subscribe = {
        method: 'UNSUBSCRIBE',
        params: [`${currencyPair.toLowerCase()}t@aggTrade`],
        id: 1,
      }
      sendMessage(JSON.stringify(subscribe))
    }
  }

  const processMessages = (event: {data: string}) => {
    const response = JSON.parse(event.data)
    // ==================
    // CONCEPT DEFINITION
    // ==================
    // "p": "0.001",     // Price
    // "q": "100",       // Quantity
    // "T": 123456785,   // Trade time
    // "m": true,        // Is the buyer the market maker?
    // "M": true         // Ignore

    const price = Number(response.data?.p || 0)
    const size = Number(response.data?.q || 0)
    const total = price * size
    const isBuyer = response.data?.m
    const pairCurrenty = response.data?.s
    const order: OrderBookItem = {
      price,
      size,
      total,
      isBuyer,
      pairCurrenty,
    }
    if (isBuyer) {
      const ordersUpdated = [...ordersBuyer.slice(-10)]
      ordersUpdated.push(order)
      setOrdersBuyer(ordersUpdated)
    } else {
      const ordersUpdated = [...ordersSeller.slice(-10)]
      ordersUpdated.push(order)
      setOrdersSeller(ordersUpdated)
    }
    setPreviousOrder({...currentOrder!})
    setCurrentOrder(order)
  }

  const onSearch = (value: string) => {
    const currencySelected = value.toLowerCase()
    if (currencySelected !== currencyPair && currencyPair !== '') {
      //unscrubscribe previous
      unSubscribeTrade(currencyPair)
    }

    setcurrencyPair(currencySelected)
    subscribeTrade(currencySelected)
  }

  return (
    <>
      <Header options={options['PI_XBTUSD']} />
      <div className="flex space-x-[5%]">
        <div className="w-[70%]">
          <TitleRow />
          {ordersBuyer.map((order, index) => {
            const {total, price, size, isBuyer} = order
            return (
              <PriceLevelRow
                key={`buyer-${index}`}
                total={formatNumber(total)}
                price={formatPrice(price)}
                size={formatNumber(size)}
                reversedFieldsOrder={isBuyer}
              />
            )
          })}
          <CurrentOrderLevel
            currentOrder={currentOrder}
            previousOrder={previousOrder}
          />
          {ordersSeller.map((order, index) => {
            const {total, price, size, isBuyer} = order
            return (
              <PriceLevelRow
                key={`seller-${index}`}
                total={formatNumber(total)}
                price={formatPrice(price)}
                size={formatNumber(size)}
                reversedFieldsOrder={isBuyer}
              />
            )
          })}
        </div>
        <div className="w-[30%] space-y-[20px]">
          <Search onSearch={onSearch} />
          <TopSearch onSearch={onSearch} />
        </div>
      </div>
      <Footer />
    </>
  )
}
