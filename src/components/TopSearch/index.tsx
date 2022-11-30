import {useEffect} from 'react'
import axios from 'axios'
import {useAsync} from '../../hooks/useAsync'

interface TopSearchProps {
  onSearch: (value: string) => void
}
const TOP_SEARCH_URL =
  'https://www.binance.com/bapi/composite/v1/public/market/hot-coins?currency=USD'
const fetchTopSearch = axios.get(TOP_SEARCH_URL)

const TopSearch = (props: TopSearchProps) => {
  const {run, data: response, isLoading} = useAsync()

  useEffect(() => {
    run(fetchTopSearch)
  }, [run])

  const topList = response?.data?.data || []
  
  //handlers
  const handleOnSelectCurrency = (currencyPair: string) => {
    props.onSearch(currencyPair.replace('/B', ''))
  }
  return (
    <div className="w-[30%]">
      <h2 className='font-bold text-[gray] mb-[10px]'>Top Search</h2>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <ul className="text-left cursor-pointer">
          {topList.map((item: any, index: number) => {
            const pair = item.symbol.replace(item.assetCode, '')
            const currencyPair = `${item.assetCode}/${pair}`
            return (
              <li
                className="space-x-[5px]"
                key={index}
                onClick={() => handleOnSelectCurrency(currencyPair)}
              >
                <span>{index + 1}</span>
                <span>{currencyPair}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TopSearch
