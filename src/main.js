import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger';
import Keycloak from "keycloak-js";

Vue.config.productionTip = false

const options = {
  isEnabled: true,
  logLevel : Vue.config.productionTip  ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};
Vue.use(VueLogger, options);


//keycloak init options
let initOptions = {
  url: 'https://kc-dev.scalenext.io', realm: 'girasol-ledger', clientId: 'girasol-ledger-app', onLoad:'login-required'
}

let keycloak = new Keycloak(initOptions);

keycloak.init(initOptions).then(auth =>{
    if(!auth) {
      window.location.reload();
    } else {
      Vue.$log.info("Authenticated");
    }

    new Vue({
      render: h => h(App),
    }).$mount('#app')


    // TODO: Maybe dont store the token in the localstore, rather use it direct from the keycloak.token object
    localStorage.setItem("vue-token", keycloak.token);
    localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

    setInterval(() =>{
      keycloak.updateToken(70).then((refreshed)=>{
        if (refreshed) {
          Vue.$log.debug('Token refreshed');
        } else {
          Vue.$log.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
      }).catch(()=>{
          Vue.$log.error('Failed to refresh token');
      });


    }, 60000)

}).catch(() =>{
  Vue.$log.error("Authenticated Failed");
});


