import cn from 'classnames'
import {OrderBookItem} from '../../pages/OrderBook'
import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'

interface CurrentOrderProps {
  currentOrder?: OrderBookItem
  previousOrder?: OrderBookItem
}

const CurrentOrderLevel = (props: CurrentOrderProps) => {
  const {currentOrder, previousOrder} = props

  let isUp = false
  if (currentOrder && previousOrder) {
    isUp = currentOrder.price < previousOrder.price
  }
  const priceClass = cn('flex items-center', {
    'text-[#118860]': isUp,
    'text-[#bb3336]': !isUp,
  })

  if (!currentOrder && !previousOrder) {
    return null
  }
  return (
    <div className={priceClass}>
      <span className="font-bold text-[25px]">{currentOrder?.price || 0}</span>
      {isUp ? (
        <NorthIcon className="!w-[15px] !h-[15px]" />
      ) : (
        <SouthIcon className="!w-[15px] !h-[15px]" />
      )}
      <span className="font-bold text-[gray] ml-[10px]">
        {`USD ${currentOrder?.price || 0}`}
      </span>
      <span className='ml-[10px]'>{currentOrder?.pairCurrenty}</span>
    </div>
  )
}

export default CurrentOrderLevel
