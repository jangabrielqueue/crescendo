import { Transition } from '@headlessui/react'
import useSnackbar from '@hooks/useSnackbar'
import { Callout } from '@tremor/react'
import React from 'react'

const Snackbar = () => {
  const { snackbars, activeSnackbars, hideSnackbar } = useSnackbar()

  return (
    <div className='absolute top-2 right-2 z-50 flex flex-col gap-2'>
      {snackbars.map((ar, idx) => (
        <Transition
          key={idx}
          show={Boolean(activeSnackbars.find(val => val.idx === ar.idx))}
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div className='bg-white rounded-lg [&_p]:mt-0 cursor-pointer' onClick={() => hideSnackbar(ar.idx)}>
            <Callout title={ar.title || ''} color={ar.color || 'red'} className='p-1 px-3 max-w-56'>
              {ar.message}
            </Callout>
          </div>
        </Transition>
      ))}
    </div>
  )
}
export default Snackbar
