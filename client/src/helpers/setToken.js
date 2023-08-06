import { Cookies } from "quasar";
import jwtDecode from 'jwt-decode';

const token = (to, from, next) => {
  const requester = jwtDecode(Cookies.get('inventoryAuth'));
  const rights = requester.user.rights;
  const user = requester.user.code;

  return {token: Cookies.get('inventoryAuth'), rights, user}
}

export default token;
