/**
 * create wallet
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { createWallet } from '../../../logic/localWallet';
import { selectImage } from '../../../logic/native';
import { pswEqualed, walletNameAvailable } from '../../../utils/account';

export class CreateWallet extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            walletName: '李铁柱',
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed:false,
            userProtocolReaded: false,
            walletPswAvailable:false,
            chooseImage:false,
            avatar:'',
            avatarHtml:''
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public walletNameChange(e: any) {
        this.state.walletName = e.value;
        this.paint();
    }
    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }
    public pswConfirmChange(r:any) {
        this.state.walletPswConfirm = r.value;
        this.state.pswEqualed = pswEqualed(this.state.walletPsw, this.state.walletPswConfirm);
        this.paint();
    }
    // 密码格式正确通知
    public pswChange(res:any) {
        this.state.walletPswAvailable = res.success;
        this.state.walletPsw = res.password;
        this.state.pswEqualed = pswEqualed(this.state.walletPsw, this.state.walletPswConfirm);
        this.paint();
    }
    public selectImageClick() {
        selectImage((width, height, base64) => {
            this.state.chooseImage = true;
            // tslint:disable-next-line:max-line-length
            this.state.avatarHtml = `<div style="background-image: url(${base64});width: 100%;height: 100%;position: absolute;top: 0;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.state.avatar = base64;
            this.paint();
        });
    }
    public async createClick() {
        if (!this.state.userProtocolReaded) {
            return;
        }
        if (!walletNameAvailable(this.state.walletName)) {
            popNew('app-components-message-message', { content: '请输入1-10位钱包名' });

            return;
        }
        if (!this.state.walletPswAvailable) {
            popNew('app-components-message-message', { content: '密码格式不正确' });

            return;
        }
        if (!this.state.pswEqualed) {
            popNew('app-components-message-message', { content: '两次输入密码不一致' });

            return;
        }

        const close = popNew('app-components1-loading-loading', { text: '创建中...' });
        await createWallet(this.state.walletPsw,this.state.walletName,this.state.avatar);
        close.callback(close.widget);
        this.ok && this.ok();
        popNew('app-components-modalBox-modalBox',{ 
            title:'创建成功',
            content:'记得备份，如果忘记账户就找不回来了。',
            sureText:'备份',
            cancelText:'暂时不' 
        },() => {
            // popNew('app-view-wallet-create-createEnter');
        });
    }
}