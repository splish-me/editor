import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { css } from 'emotion'
import * as React from 'react'
import Select from 'react-select'

export interface DropDownProps {
  options?: any
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  label?: string
  value: string
}

const customStyles = {
  container: () => ({
    width: 'auto !important',
    borderRadius: '0',
    display: 'inline-block',
    textAlign: 'center'
  }),
  valueContainer: provided => ({
    ...provided,
    backgroundColor: '#333333',
    paddingRight: '0px',
    cursor: 'pointer'
  }),
  singleValue: () => ({
    backgroundColoer: '#333333',
    color: '#469bff',
    cursor: 'pointer'
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: state => ({
    paddingLeft: '0x',
    cursor: 'pointer',
    color: state.isFocused ? '#469bff' : '#ffffff'
  }),
  placeholder: state => ({
    backgroundColor: '#333333',
    color: '#ffffff'
  }),
  option: (provided, state) => ({
    backgroundColor: '#666666',
    paddingBottom: '5px',
    fontFamily: 'Open Sans',
    color: state.isSelected ? '#469bff' : '#ffffff',
    '&:hover': {
      color: '#90c3ff'
    }
  }),
  control: (provided, state) => ({
    ...provided,
    width: 'auto !important',
    fontFamily: 'Open Sans',
    backgroundColor: '#333333',
    borderRadius: 0,
    height: '40px',
    border: 'none',
    '&:hover': {
      backgroundColor: '#999999',
      color: state.isSelected ? '#469bff' : '#666666'
    }
  })
}
export default class SidebarDropDown extends React.Component<DropDownProps> {
  render() {
    const { options, onChange, label, value } = this.props
    return (
      <Select
        {...this.props}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={label}
        styles={customStyles}
      >
        {console.log('in select:', value)}
      </Select>
      // <select
      //   className={css({
      //     marginTop: '5px',
      //     WebkitAppearance: 'none',
      //     MozAppearance: 'none',
      //     appearance: 'none',
      //     backgroundImage: faAngleDown,
      //     backgroundPosition: 'right',
      //     backgroundRepeat: 'no-repeat',
      //     border: 'none',
      //     outline: 'none',
      //     borderRadius: '5px',
      //     padding: '2px 10px',
      //     color: '#333333',
      //     '&:focus': {
      //       border: '2px solid #469BFF'
      //     }
      //   })}
      //   value={value}
      //   onChange={onChange}
      //   {...props}
      // >
      //   {options.map((element: string, index: number) => {
      //     return (
      //       <option
      //         value={element}
      //         key={index}
      //         className={css({
      //           backgroundColor: '#CCCCCC',

      //           '&:last-child': { borderRadius: '5px' }
      //         })}
      //       >
      //         {element}
      //       </option>
      //     )
      //   })}
      // </select>
    )
  }
}
