import React, { useState } from 'react'
import { DropDownPicker, FilePicker } from '.'

export default function Input(props) {
  //   const [value, setVlaue] = useState()

  const handleInput = (e) => {
    e.preventDefault()
    // setVlaue(e.target.value)
    props?.onChange(e.target.value)
  }
  // console.log(value);

  const renderUi = () => {
    var render = null
    switch (props.type) {
      case 'text':
        render = (
          <div className={'my-5 ' + props?.className}>
            <p className="text-sm">
              {props?.title}
              {props?.required && <span className="text-red-600 ml-1">*</span>}
            </p>
            <p className="text-xs text-gray-400">{props?.description}</p>
            <input
              placeholder={props?.placeholder}
              className="w-full border p-1 px-3 rounded my-2"
              onChange={(e) => handleInput(e)}
              type={props?.keyboardType || 'text'}
            />
            <p className='text-sm text-red-400'>{props?.errorMessage}</p>
          </div>
        )
        break
      case 'file':
        render = (
          <FilePicker
            value={props?.value}
            handleFile={(e) => props?.onChange(e)}
          />
        )
        break
      case 'dropdownpicker':
        render = (
          <div className="my-5">
            <p className="text-sm">
              {props?.title}
              {props?.required && <span className="text-red-600 ml-1">*</span>}
            </p>
            <p className="text-xs text-gray-400">{props?.description}</p>
            <DropDownPicker {...props} onChange={(e) => props.onChange(e)} />
          </div>
        )
        break
      case 'date':
        render = (
          <div className="my-5">
            <p className="text-sm">
              {props?.title}
              {props?.required && <span className="text-red-600 ml-1">*</span>}
            </p>
            <input
              type="date"
              className="w-full border p-1 rounded-md text-gray-500"
              onChange={(e) => handleInput(e)}
            />
            <p className="text-xs text-gray-400">{props?.description}</p>
          </div>
        )
        break
      default:
        render = (
          <div className="my-5">
            <p className="text-sm">
              {props?.title}
              {props?.required && <span className="text-red-600 ml-1">*</span>}
            </p>
            <p className="text-xs text-gray-400">{props?.description}</p>
            <textarea
              placeholder={props?.placeholder}
              className="w-full border p-1 px-3 rounded my-2"
              onChange={(e) => handleInput(e)}
            />
          </div>
        )
        break
    }

    return render
  }
  return <>{renderUi()}</>
}
