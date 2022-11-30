import cn from 'classnames'
interface PriceLevelRowProps {
  total: string
  size: string
  price: string
  reversedFieldsOrder: boolean
  windowWidth?: number
}

const PriceLevelRow = (props: PriceLevelRowProps) => {
  const {total, price, size, reversedFieldsOrder} = props

  const isRight = !reversedFieldsOrder

  //styles
  const titleClass = 'z-[1] min-w-[54px] text-white'
  const afterClass = cn(
    `after:content-[''] after:h-full after:py-[0.3em] after:px-[0px] after:absoulte`,
    {
      'after:bg-[#113534]': isRight,
      'after:bg-[#3d1e28]': !isRight,
    }
  )
  const priceClass = cn('', {
    '!text-[#118860]': isRight,
    '!text-[#bb3336]': !isRight,
  })
  return (
    <div className={`flex relative bg-[#121723] justify-around ${afterClass}`}>
      <span className={`${titleClass} ${priceClass}`}>{price}</span>
      <span className={titleClass}>{size}</span>
      <span className={titleClass}>{total}</span>
    </div>
  )
}

export default PriceLevelRow
