import axios, { HeadersDefaults } from "axios"

const axiosClient = axios.create()

// authHeader();
interface CommonHeaderProperties extends HeadersDefaults {
  "Content-Type": string
  Accept: string
  Authorization: string
}

axiosClient.defaults.baseURL = "http://localhost:3000/api"

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
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
  return "Bearer " + localStorage.getItem("prevozniciJWT")
}
