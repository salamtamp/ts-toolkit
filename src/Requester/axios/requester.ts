import axios from 'axios';

class AxiosRequester {
  get(endpoint: string, headers: object): Promise<any> {
    return axios.get(endpoint, { headers });
  }

  post(endpoint: string, headers: object, payload: any): Promise<any> {
    return axios.post(endpoint, payload, { headers });
  }
}

export default AxiosRequester;
