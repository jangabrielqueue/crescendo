import { AuthContext } from '@context/AuthContext'
import config from '@utils/env'
import { Base64 } from 'js-base64'
import { useContext } from 'react'

type ApiJwtDetails = {
  id: string
  username: string
  roleid: string
  role: string
  rolename: string
  operator: string
  operatorid: string
  exp: number
}
interface AuthDetail {
  id: number
  username: string
  roleid: number
  role: string
  rolename: string
  operator: string
  operatorid: number
  expiration: Date
  isAuthenticated: boolean
}

const getDateFromEpoch = (epoch: number) => {
  const d = new Date(0)
  d.setUTCSeconds(epoch)
  return d
}

const getIsAuthenticated = (exp: number) => {
  const d = new Date().getTime() / 1000
  return exp > d
}
const decodeAuth = (auth: string | undefined | null): AuthDetail | Record<string, never> => {
  if (auth == null) return {}
  try {
    const base64Url = decodeURIComponent(auth).split('.')[1]
    const base64Clean = base64Url.replace('-', '+').replace('_', '/')

    const decodedAuth: ApiJwtDetails = JSON.parse(Base64.decode(base64Clean))

    const authDetail: AuthDetail = {
      id: parseInt(decodedAuth.id),
      username: decodedAuth.username,
      roleid: parseInt(decodedAuth.roleid),
      role: decodedAuth.role,
      rolename: decodedAuth.rolename,
      operator: decodedAuth.operator,
      operatorid: parseInt(decodedAuth.operatorid),
      expiration: getDateFromEpoch(decodedAuth.exp),
      isAuthenticated: getIsAuthenticated(decodedAuth.exp)
    }

    return authDetail
  } catch (err) {
    return {}
  }
}

export const useAuth = () => {
  const [authToken, setAuthToken] = useContext(AuthContext)
  const decodedAuth = decodeAuth(authToken)

  const handleSetAuthToken = (data: string | null) => {
    setAuthToken(data)
  }

  const handleCasLogin = () => {
    window.location.href = `${config.casURL}login?next=${window.location.protocol}//${window.location.host + config.relativeRoot}auth&client=${config.casClientId}&op=${config.casOperator}`
  }
  const handleCasLogout = async () => {
    window.localStorage.removeItem(config.authKey)
    window.location.href = `${config.casURL}logout?client=${config.casClientId}&op=${config.casOperator}`
  }

  return { authToken, CasLogout: handleCasLogout, setAuthToken: handleSetAuthToken, decodedAuth, CasLogin: handleCasLogin }
}
