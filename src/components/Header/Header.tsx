import GroupingSelectBox from '../GroupingSelectBox/GroupingSelectBox'

interface HeaderProps {
  options: number[]
}

const Header = (props: HeaderProps) => {
  const {options} = props
  return (
    <>
      <h3>Order Book</h3>
      <GroupingSelectBox options={options} />
    </>
  )
}

export default Header
