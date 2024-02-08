import Snackbar from '@components/Snackbar'
import { createContext, useState } from 'react'

export interface Snackbar {
  message: string
  title?: string
  idx: number
  color?: string
}

interface SnackbarContextValue {
  snackbars: [Snackbar[], React.Dispatch<React.SetStateAction<Snackbar[]>>]
  activeSnackbars: [Snackbar[], React.Dispatch<React.SetStateAction<Snackbar[]>>]
}

export const SnackbarContext = createContext<SnackbarContextValue>({
  snackbars: [[], () => { }],
  activeSnackbars: [[], () => { }]

})

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const snackbars = useState<Snackbar[]>([])
  const activeSnackbars = useState<Snackbar[]>([])
  return (
    <SnackbarContext.Provider value={{ snackbars, activeSnackbars }}>
      <Snackbar />
      {children}
    </SnackbarContext.Provider>
  )
}
export default SnackbarProvider 