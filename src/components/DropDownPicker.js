import React, { useRef, useEffect, useState } from 'react'

export function DropBox(props) {
  const ref = useRef(null)
  const { onClickOutside } = props

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [onClickOutside])

  if (!props.show) return null

  return <div ref={ref} >{props.children}</div>
}

function DropDown(props) {
  const [show, setShow] = useState(false)
  const [value, setValue] = useState(null)
  const [options, setOptions] = useState(props.options)
  
  const inputReference = useRef(null);

  useEffect(() => {
    show && inputReference.current.focus();
    setOptions(props?.options)
  }, [show]);



  return (
    <div className={props?.class}  >
      <button className={`w-full relative border rounded-md mt-2 ${!show&&'p-2'}`} onClick={()=> setShow(true)}>
    {show ? <input 
              ref={inputReference} 
              onChange={(e)=>{
                if(e.target.value == ''){
                  setOptions(props?.options)
                }else{
                  var newOptions = [];
                  if(props.type == 'number'){
                    newOptions = options.filter((__, k)=> __.value >= e.target.value)
                  }else{
                    newOptions = options.filter((__, k)=> __.value.toLowerCase().includes(e.target.value))
                  }
                  setOptions(newOptions)
                }
              }}
              placeholder='search' 
              className="w-4/5 p-2 focus-within:border-none"/> : 
        <span 
        className={`${value == null ? "text-gray-400" : ""} "text-left"`}
         >{value != null ? value : props?.placeholder?props.placeholder: 'Select your option ' }
        </span>}
      <span className="material-symbols-outlined ml-3 absolute right-5 top-2">{ show ? 'search' : 'expand_circle_down'}</span>
      </button>
      <DropBox
        show={show}
        onClickOutside={() => {
          setShow(!show)
        }}
        className="my-10"
      >
        <ul className="absolute bg-white z-40 border overflow-y-scroll max-h-96" 
        >
          {options&&options.map((_, k) => {
            return (
              <li key={k}>
                  <button className=" hover:bg-gray-200 p-2 inline-flex border-b text-center "
                  style={{width: '100%'}}
                    onClick={()=>{
                    setValue(_?.name || _?.value)
                    setShow(false)
                    props?.onChange && props.onChange({name:_.name, value:_.value})
                  }}>
                    {_?.logo && <img src={_.logo} className="w-6 h-6" />}                    
                    <p className="mx-10 font-normal text-sm">{_?.name || _?.value}</p>
                  </button>
              </li>
            )
          })}
        </ul>
      </DropBox>
    </div>
  )
}

export default DropDown

DropDown.defaultProps = {
  options: [{name: 'NO OPTIONS', id: null, type: 'text'}]
}