import React from 'react'

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null)

  const handleClick = (event) => {
    hiddenFileInput.current.click()
  }
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0]
    props.handleFile(fileUploaded)
  }
  return (
    <div
      className="flex-none my-2 border-dashed border-2 rounded-lg p-5 hover:bg-gray-100 relative"
      onClick={handleClick}
    >
      {!props?.value ? (
        <span className="material-symbols-outlined text-7xl text-gray-300">
          image
        </span>
      ) : (
        <img
          src={props.value}
          alt="Cover"
          className="object-cover"
        />
      )}

      {/* <p>Upload a file</p> */}
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
export default FileUploader
