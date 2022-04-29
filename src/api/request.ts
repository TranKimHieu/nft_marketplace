import axios from "axios";
import config from "../utils/config";

const request = axios.create({
    baseURL: config.BASE_API,
    timeout: 3000,
    headers: {
        "Access-Control-Allow-Origin": '*',
        "Content-Type": 'application/json;charset=utf-8'
    }
  })

  export default request;