import {useState, ChangeEvent, KeyboardEvent} from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface SearchProps {
  onSearch: (value: string) => void
}

const Search = (props: SearchProps) => {
  const [currencyPair, setcurrencyPair] = useState('')

  //handlers
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value!
    setcurrencyPair(value)
  }
  const handleOnKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (currencyPair.includes('/') && currencyPair.length > 0) {
        console.log('handleOnKeyPress::', currencyPair);
        props.onSearch(currencyPair.replace('/', ''))
      }
    }
  }

  return (
    <>
      <div className="flex items-center w-[100%]">
        <div className="flex grow bg-white h-[40px] py-[5px] px-[10px] border rounded-[24px] border-gray-200 items-center space-x-2 shadow-xl">
          <IconButton type="button" sx={{p: '10px'}} aria-label="search">
            <SearchIcon />
          </IconButton>

          <InputBase
            placeholder="type pair currency and press Enter"
            value={currencyPair}
            onChange={handleOnChange}
            onKeyPress={handleOnKeyPress}
            className="grow"
            size="medium"
          />
        </div>
        <div className="flex justify-center items-center ml-[5px] hoverButton">
          <IconButton className="!p-0 w-max h-max">
            <InfoOutlinedIcon className="!w-[22px] !h-[22px]" />
          </IconButton>
        </div>
      </div>
    </>
  )
}

export default Search
