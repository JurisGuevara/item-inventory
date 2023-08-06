import { Cookies } from "quasar";

const authToken = (to, from, next) => {
  if(Cookies.get('inventoryAuth') === null) {
    next('/login')
  } else {
    next()
  }
}

const notAuthToken = (to, from, next) => {
  if(Cookies.get('inventoryAuth') === null) {
    next()
  } else {
    next('/itemlist')
  }
}

export default {authToken, notAuthToken};
