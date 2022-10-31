
// import WalletConnect from "@walletconnect/web3-provider/dist/umd/index.min";
// import type { BigNumber, BigNumberish } from "ethers"; 

import { HttpClient, OAuth2AuthCodePKCE } from '@bity/oauth2-auth-code-pkce';

// export type GameStruct = {
//     timestamp: BigNumberish ; 
//     white : String ;
//     black : String ;
//     whiteResult : BigNumberish , 
//     blackResult : BigNumberish ,
//     whiteElo : BigNumberish ,
//     BlackElo : BigNumberish ,

//   };


// let contractAgruments : GameStruct = {
//     timestamp : 1665036973200 , 
//     white : '0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440' ,
//     black : '0x0000000000000000000000000000000000000000' ,
//     whiteResult : 0 ,
//     blackResult : 1 ,
//     whiteElo : 1500 ,
//     BlackElo : 1520

//    } 


// export const lichessHost = 'http://l.org';
export const scopes = ['board:play'];
export const clientId = 'lichess-api-demo';
export const lichessHost = 'https://lichess.org';
export const BASE_PATH = location.pathname.replace(/\/$/, '');

export const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || '/'}`;
//  export const clientUrl = `http://localhost:5173/`; 



export interface Me {
  id: string;
  username: string;
  httpClient: HttpClient; // with pre-set Authorization header
  perfs: { [key: string]: any };
}

export class Auth {
  oauth = new OAuth2AuthCodePKCE({
    authorizationUrl: `${lichessHost}/oauth`,
    tokenUrl: `${lichessHost}/api/token`,
    clientId,
    scopes,
    redirectUrl: clientUrl,
    onAccessTokenExpiry: refreshAccessToken => refreshAccessToken(),
    onInvalidGrant: _retry => { },
  });
  me?: Me;

  async init() {
    try {
      const accessContext = await this.oauth.getAccessToken();
      if (accessContext) await this.authenticate();
    } catch (err) {
      console.error(err);
    }
    if (!this.me) {
      try {
        const hasAuthCode = await this.oauth.isReturningFromAuthServer();
        if (hasAuthCode) {
          await this.authenticate();
        }
      } catch (err) {
        console.error(err);
      }
    }

  }

  async login() {
    return await this.oauth.fetchAuthorizationCode();
  }

  async logout() {
    if (this.me) await this.me.httpClient(`${lichessHost}/api/token`, { method: 'DELETE' });
    localStorage.clear();
    this.me = undefined;
  }

  private authenticate = async () => {
    const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const me = {
      ...(await res.json()),
      httpClient,
    };
    if (me.error) throw me.error;
    this.me = me;
  };


  fetchBody = async (path: string, config: any = {}) => {
    const res = await this.fetchResponse(path, config);
    const body = await res.json();
    return body;
  };

  private fetchResponse = async (path: string, config: any = {}) => {
    const res = await this.me?.httpClient(`${lichessHost}${path}`, config);
    if (res.error || !res.ok) {
      const err = `${res.error} ${res.status} ${res.statusText}`;
      alert(err);
      throw err;
    }
    return res;
  };
}

