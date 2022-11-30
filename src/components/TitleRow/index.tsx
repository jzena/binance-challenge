import React from 'react'

interface TitleRowProps {
  reversedFieldsOrder?: boolean
  windowWidth?: number
}

export const TitleRow = (props: TitleRowProps) => {
  const {reversedFieldsOrder = false} = props
  const classTitle = 'min-w-[5rem]'
  return (
    <div className="flex bg-[#121723] justify-around text-[#98a6af] p-[0.3em]">
      <span className={`${classTitle}`}>PRICE</span>
      <span className={classTitle}>AMOUNT</span>
      <span className={classTitle}>TOTAL</span>
    </div>
  )
}

export default TitleRow
