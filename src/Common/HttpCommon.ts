
import axios from "axios";
import { Constants } from "../Constants/Constants";

export default axios.create({
  baseURL: Constants.BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
