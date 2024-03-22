import { ModalContext, ModalState } from '@context/ModalContext'
import useModal from '@hooks/useModal'
import { Dialog, DialogPanel } from '@tremor/react'
import { useContext, useState } from 'react'

const Modal = () => {
  const { modalState: [modal] } = useContext(ModalContext)
  const { closeModal } = useModal()
  return (
    <Dialog open={modal != null} onClose={closeModal} static>
      <ModalPanel modal={modal} />
    </Dialog>
  )
}

const ModalPanel = ({ modal: pModal }: { modal?: ModalState }) => {
  const [modal] = useState(pModal)
  return (
    <DialogPanel className={modal?.panelClassName}>
      {modal?.title && <h1 className='text-tremor-title font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>{modal?.title}</h1>}
      {modal?.body()}
    </DialogPanel>
  )
}
export default Modal
