/**
 * @file store
 * @author donghr
 */
declare const window;
// ============================================ 导入
import { HandlerMap } from '../../pi/util/event';
import { cryptoRandomInt } from '../../pi/util/math';
import { config } from '../core/config';
// tslint:disable-next-line:max-line-length
import { defaultExchangeRateJsonMain, defaultExchangeRateJsonTest, supportCurrencyListMain, supportCurrencyListTest } from '../utils/constants';
import { depCopy } from '../utils/tools';
// tslint:disable-next-line:max-line-length
import { AccountDetail, AddMineItem, Addr, CHisRec, CurrencyInfo, CurrencyType, DividendItem, DividTotal, LockScreen, LoginState, MineRank, MiningRank, MiningTotal, SHisRec, Store, TopContact, TransactionRecord ,Wallet } from './interface';

// ============================================ 导出
/**
 * 根据keyName返回相应的数据，map数据会被转换为数组
 * 若传入id参数,则会取相应map的值
 */
// tslint:disable-next-line:no-any
export const find = (keyName: KeyName, id?: number | string): any => {
    if (!id) {
        const value = store[keyName];
        if (!(value instanceof Map)) {
            return value instanceof Object ? depCopy(value) : value;
        }
        const arr = [];
        for (const [, v] of value) {
            arr.push(v);
        }

        return depCopy(arr);
    }
    const value = store[keyName].get(id);
    if (value instanceof Map) {
        const result = value.get(id);

        return result && depCopy(result);
    } else {
        return value && depCopy(value);
    }
};

/**
 * 返回原始数据结构
 */
export const getBorn = (keyname) => {
    return store[keyname];
};

/**
 * 更新store并通知
 */
// tslint:disable-next-line:no-any
export const updateStore = (keyName: KeyName, data: any, notified: boolean = true): void => {
    store[keyName] = data;
    if (notified) handlerMap.notify(keyName, [find(keyName)]);
};

/**
 * 更新store---后续考虑移除
 */
export const notify = (keyName: KeyName, data?: any) => {
    handlerMap.notify(keyName, [data]);
};
/**
 * 消息处理器
 */
export const register = (keyName: KeyName, cb: Function): void => {
    handlerMap.add(keyName, <any>cb);
};

export const unregister = (keyName: KeyName, cb: Function): void => {
    handlerMap.remove(keyName, <any>cb);
};

export const initStore = () => {
    // 从localStorage中取wallets
    const wallets = findByLoc('wallets');
    store.walletList = (wallets && wallets.walletList) || [];
    // 从localStorage中取addrs
    store.addrs = findByLoc('addrs') || [];
    // 从localStorage中取transactions
    store.transactions = findByLoc('transactions') || [];
    // 从localStorage中的wallets中初始化salt
    store.salt = (wallets && wallets.salt) || cryptoRandomInt().toString();
    // 从localStorage中的wallets中初始化curWallet
    store.curWallet = wallets && wallets.walletList.length > 0 && wallets.walletList.filter(v => v.walletId === wallets.curWalletId)[0];
    // 从localStorage中取readedPriAgr
    store.readedPriAgr = findByLoc('readedPriAgr');
    // 从localStorage中取lockScreen
    store.lockScreen = findByLoc('lockScreen') || {};
    // 从localStorage中取sHisRec
    store.sHisRec = findByLoc('sHisRec') || {};
    // 从localStorage中取cHisRec
    store.cHisRec = findByLoc('cHisRec') || {};
    // 从localStorage中取常用联系人列表
    store.TopContacts = findByLoc('TopContacts') || [];

    // 初始化默认兑换汇率列表
    const rateJson = config.currentNetIsTest ? defaultExchangeRateJsonTest : defaultExchangeRateJsonMain;
    const m = new Map();
    for (const key in rateJson) {
        if (rateJson.hasOwnProperty(key)) { m.set(key, rateJson[key]); }
    }
    store.exchangeRateJson = m;

    // 初始化货币信息列表
    store.currencyList = config.currentNetIsTest ? supportCurrencyListTest : supportCurrencyListMain;

};

// tslint:disable-next-line:max-line-length
type KeyName = MapName | LocKeyName | 'walletList' | 'curWallet' | 'addrs' | 'salt' | 'transactions' | 'cloudBalance' | 'conUser' | 'conUserPublicKey' | 'conRandom' | 'conUid' | 'currencyList' | 'shapeShiftCoins' | 'loginState' | 'miningTotal' | 'miningHistory' | 'dividHistory' | 'accountDetail' |
    'dividTotal' | 'addMine' | 'mineRank' | 'miningRank'| 'TopContacts';

type MapName = 'exchangeRateJson' | 'hashMap';

// ============================================ 本地
type LocKeyName = 'wallets' | 'addrs' | 'transactions' | 'readedPriAgr' | 'lockScreen' | 'sHisRec' | 'cHisRec' | 'TopContacts';
const findByLoc = (keyName: LocKeyName): any => {
    const value = JSON.parse(localStorage.getItem(keyName));

    return value instanceof Object ? depCopy(value) : value;
};

// ============================================ 立即执行
/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

// tslint:disable-next-line:no-object-literal-type-assertion
const store = <Store>{
    // 基础数据
    hashMap: new Map<string, string>(),// 输入密码后hash缓存
    salt: '',// 盐--加密时使用
    conUser: '',// 连接用户
    conUserPublicKey: '',// 连接用户公钥
    conRandom: '',// 连接随机数
    conUid: 0,// 连接uid
    readedPriAgr: false, // 是否阅读隐私协议
    loginState: LoginState.init,// 连接状态
    // 本地钱包
    walletList: <Wallet[]>[],// 钱包数据
    curWallet: <Wallet>null,// 当前钱包
    addrs: <Addr[]>[],// 地址数据
    transactions: <TransactionRecord[]>[],// 交易记录
    exchangeRateJson: new Map<string, any>(),// 兑换汇率列表
    currencyList: <CurrencyInfo[]>[],// 货币信息列表
    shapeShiftCoins: <any>[],// shapeShift 支持的币种
    lockScreen: <LockScreen>null, // 锁屏密码相关
    sHisRec: <SHisRec>null, // 发送红包记录
    cHisRec: <CHisRec>null,// 兑换红包记录
    // 云端数据
    cloudBalance: new Map<CurrencyType, number>(),// 云端账户余额
    accountDetail: new Map<CurrencyType, AccountDetail[]>(),// 云端账户详情
    miningTotal: <MiningTotal>null, // 挖矿汇总信息
    dividTotal: <DividTotal>null,// 分红汇总信息
    miningHistory: <DividendItem[]>[],// 挖矿历史记录
    dividHistory: <DividendItem[]>[],// 分红历史记录
    addMine: <AddMineItem[]>[],// 矿山增加项目
    mineRank: <MineRank>null,// 矿山排名
    miningRank: <MiningRank>null,// 挖矿排名
    // 地址管理
    TopContacts:<TopContact[]>[]// 常用联系人列表   
};
