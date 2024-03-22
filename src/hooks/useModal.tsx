import { ModalContext } from '@context/ModalContext'
import { useContext } from 'react'

const useModal = () => {
  const { modalState: [modal, setModal] } = useContext(ModalContext)
  const closeModal = () => {
    modal?.onClose && modal.onClose()
    setModal(undefined)
  }
  return { closeModal, setModal }
}

export default useModal
