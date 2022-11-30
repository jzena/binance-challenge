import {ChangeEvent, useState} from 'react'

interface GroupingSelectBoxProps {
  options: number[]
}

const GroupingSelectBox = (props: GroupingSelectBoxProps) => {
  const [grouping, setGrouping] = useState(0)

  const {options} = props

  //handlers
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const grouping = Number(event.target.value)
    setGrouping(grouping)
  }
  return (
    <>
      <select
        data-testid="groupings"
        name="groupings"
        onChange={handleChange}
        defaultValue={grouping}
        className="border-none border-[3px] p-[0.3em] text-[white] bg-[#303947] hover:cursor-pointer"
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            Group {option}
          </option>
        ))}
      </select>
    </>
  )
}

export default GroupingSelectBox
