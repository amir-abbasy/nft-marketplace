/* This example requires Tailwind CSS v2.0+ */
import { useRef, useState } from 'react'

export default function Modal(props) {
  const cancelButtonRef = useRef(null)

  if (!props?.show) return null
  return (
    <>
      <div>
        <div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </div>
        {/* body */}
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <div>
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <span
                  onClick={() => props?.setShowModal(false)}
                  className="material-symbols-outlined absolute right-5 top-3 cursor-pointer text-gray-400 hover:text-gray-800"
                >
                  close
                </span>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {props.children}
                </div>
                {props?.onClickSuccessButton && (
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  ${
                        props?.successButtonColor
                          ? props.successButtonColor
                          : 'bg-green-600'
                      } text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() =>
                        props?.onClickSuccessButton
                          ? props?.onClickSuccessButton()
                          : props?.setShowModal(false)
                      }
                    >
                      {props?.successButtonTitle || 'Deactivate'}
                    </button>
                    {props?.cancelButtonTitle && (
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() =>
                          props?.onClickCancelButton
                            ? props?.onClickCancelButton()
                            : props?.setShowModal(false)
                        }
                        ref={cancelButtonRef}
                      >
                        {props?.cancelButtonTitle || 'Cancel'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
