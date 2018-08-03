/**
 * 连接管理
 */
import { open, request, setUrl } from '../../pi/net/ui/con_mgr';
import { EthWallet } from '../core/eth/wallet';
import { sign } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { getCurrentWallet, getLocalStorage, openBasePage } from '../utils/tools';
import { dataCenter } from './dataCenter';

/**
 * 枚举登录状态
 */
export enum LoginState {
    init = 0,
    logining,
    logined,
    relogining,
    logouting,
    logouted,
    logerror
}
/**
 * 货币类型
 */
export enum CurrencyType {
    KT = 100,
    ETH
}
/**
 * 登录状态
 */
let loginState: number = LoginState.init;

// 设置登录状态
const setLoginState = (s: number) => {
    if (loginState === s) {
        return;
    }
    loginState = s;
};
/**
 * 通用的异步通信
 */
export const requestAsync = async (msg: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp.type);
            } else if (resp.result !== undefined) {
                resolve(resp);
            }
        });
    });
};
/**
 * 验证登录的异步通信
 */
export const requestLogined = async (msg: any) => {
    if (loginState === LoginState.logined) {
        return requestAsync(msg);
    } else {
        const wallets = getLocalStorage('wallets');
        const wallet = getCurrentWallet(wallets);
        let passwd = '';
        if (!dataCenter.getHash(wallet.walletId)) {
            passwd = await openBasePage('app-components-message-messageboxPrompt', {
                title: '输入密码', content: '', inputType: 'password'
            });
        }
        const wlt: EthWallet = await GlobalWallet.createWlt('ETH', passwd, wallet, 0);
        const signStr = sign(dataCenter.getConRandom(), wlt.exportPrivateKey());
        const msgLogin = { type: 'login', param: { sign: signStr } };
        setLoginState(LoginState.logining);
        const res: any = await requestAsync(msgLogin);
        if (res.result === 1) {
            setLoginState(LoginState.logined);

            return requestAsync(msg);
        }
        setLoginState(LoginState.logerror);

        return;
    }

};

/**
 * 开启连接并获取验证随机数
 */
export const openAndGetRandom = async () => {
    const wallets = getLocalStorage('wallets');
    const wallet = getCurrentWallet(wallets);
    if (!wallet) return;
    if (dataCenter.getUser() === wallet.walletId) return;
    setUrl(`ws://127.0.0.1:2081`);
    dataCenter.setUser(wallet.walletId);

    return new Promise((resolve, reject) => {
        open(() => {
            const gwlt = GlobalWallet.fromJSON(wallet.gwlt);
            // 连接打开后开始设置账号缓存
            const msg = { type: 'get_random', param: { account: wallet.walletId.slice(2), pk: `04${gwlt.publicKey}` } };
            request(msg, (resp) => {
                if (resp.type) {
                    console.log(`错误信息为${resp.type}`);
                    reject(resp.type);
                } else if (resp.result !== undefined) {
                    dataCenter.setConRandom(resp.rand);
                    resolve(resp);
                }
            });
        }, (result) => {
            console.log(`open错误信息为${result}`);
            reject(result);
        });
    });

};

/**
 * 获取所有的货币余额
 */
export const getAllBalance = async () => {
    const msg = { type: 'wallet/account@get', param: { list: `[${CurrencyType.KT}, ${CurrencyType.ETH}]` } };

    return requestAsync(msg);
};

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };

    return requestAsync(msg);
};