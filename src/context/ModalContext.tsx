import Modal from '@components/Modal'
import { createContext, useState } from 'react'

export interface ModalState {
  body: () => JSX.Element
  title?: string
  onClose?: () => void
  panelClassName?: string
}

export const ModalContext = createContext<{
  modalState: [ModalState | undefined, React.Dispatch<React.SetStateAction<ModalState | undefined>>],
  // postData: [object, React.Dispatch<React.SetStateAction<object>>]
}>({
  modalState: [undefined, () => { }],
  // postData: [{}, () => { }]
})

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const modalState = useState<ModalState>()
  // const postData = useState<object>({})
  return (
    <ModalContext.Provider value={{ modalState }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
