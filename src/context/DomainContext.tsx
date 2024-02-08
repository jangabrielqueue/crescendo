import { createContext } from 'react'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { ObjectValues } from '@utils/interface'

const domainEnum = {
  GPI: 'gpi',
  CRESCENDO: 'crescendo'
} as const

export type Domain = ObjectValues<typeof domainEnum>

export const DomainContext = createContext<[Domain | null | undefined, (val: Domain | null) => void]>([null, () => { }])

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  const domainkey = useLocalStorage<Domain | null>('domainkey', null)
  return <DomainContext.Provider value={domainkey}>{children}</DomainContext.Provider>
}
