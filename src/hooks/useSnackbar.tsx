import { SnackbarContext } from '@context/SnackbarContext'
import { useContext } from 'react'

type ShowSnackbarArgs = { message: string, title?: string, duration?: number, color?: string }
// interface SnackbarContextValue {
//   snackbars: Snackbar[]
//   showSnackbar: (args: ShowSnackbarArgs) => void
//   hideSnackbar: (idx: number) => void
//   showError: (e: unknown) => void
//   activeSnackbars: Snackbar[]
// }

const useSnackbar = () => {
  const {
    snackbars: [snackbars, setSnackbars],
    activeSnackbars: [activeSnackbars, setActiveSnackbars]
  } = useContext(SnackbarContext)

  const hideSnackbar = (idx: number) => {
    setActiveSnackbars(prev => prev.filter(val => val.idx !== idx))
    setTimeout(() => {
      setSnackbars(prev => prev.filter(val => val.idx !== idx))
    }, 1000)
  }

  const showSnackbar = (args: ShowSnackbarArgs) => {
    const { duration = 5000, ...rest } = args
    const idx = Math.random()
    setTimeout(() => {
      hideSnackbar(idx)
    }, duration)

    setSnackbars(prev => ([...prev, { ...rest, idx }]))

    setTimeout(() => {
      setActiveSnackbars(prev => ([...prev, { ...rest, idx }]))
    }, 100)
  }

  const showError = (error: unknown) => {
    if (error instanceof Error) {
      showSnackbar({
        message: error.message,
        title: error.name
      })
    }
  }
  return { snackbars, showSnackbar, hideSnackbar, showError, activeSnackbars }
}

export default useSnackbar