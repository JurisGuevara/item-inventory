import axios from 'axios';

const setIdList = async (url, token) => {
  const data = await axios.get(url, { headers: {"Authorization" : `Bearer ${token}`} })
    .then(res => {
      if(res.status === 200 && res.data) {
        return res.data;
      }
    })
  return data;
}

export default {
  setIdList,
};
