import axios, { HeadersDefaults } from "axios"

const axiosClient = axios.create()

// authHeader();
interface CommonHeaderProperties extends HeadersDefaults {
  Accept: string
  Authorization: string
}

axiosClient.defaults.baseURL = "http://localhost:3000/api"

axiosClient.defaults.headers = {
  Accept: "application/json",
  Authorization: authHeader()
} as CommonHeaderProperties

export default axiosClient

export function setToken() {
  axiosClient.defaults.headers = {
    Authorization: authHeader()
  } as CommonHeaderProperties
}

function authHeader() {
  return localStorage.getItem("prevozniciJWT")
}
