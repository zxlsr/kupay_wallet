/**
 * image import 
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { doScanQrCode } from '../../../logic/native';
import { CreateWalletType } from '../../../store/interface';
import { forelet,WIDGET_NAME } from './home';
import { mnemonicFragmentDecrypt } from '../../../utils/tools';

export class FragmentImport extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            fragment1:'',
            fragment2:''
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public fragment1Change(e:any) {
        this.state.fragment1 = e.value;
        this.paint();
    }
    public fragment2Change(e:any) {
        this.state.fragment2 = e.value;
        this.paint();
    }
    public doScanQRCode(e:any,num:number) {
        doScanQrCode((fragment) => {
            this.state[`fragment${num}`] = fragment;
            this.paint();
        });
        console.log(num);
    }
    public nextClick() {
        if (!this.state.fragment1) {
            popNew('app-components-message-message', { content: '请输入片段1' });

            return;
        }
        if (!this.state.fragment2) {
            popNew('app-components-message-message', { content: '请输入片段2' });

            return;
        }
        if (this.state.fragment1 === this.state.fragment2) {
            popNew('app-components-message-message', { content: '两次输入的片段一致' });

            return;
        }
        const obj1 = mnemonicFragmentDecrypt(this.state.fragment1);
        const decryptFragement1 = obj1.fragment;
        const random1 = obj1.randomStr;
        const obj2 = mnemonicFragmentDecrypt(this.state.fragment2);
        const decryptFragement2 = obj2.fragment;
        const random2 = obj2.randomStr;
        if (random1 !== random2) {
            popNew('app-components-message-message', { content: '此片段不是同一组密钥' });

            return;
        }
        popNew('app-view-wallet-create-createWallet',{ itype:CreateWalletType.FragmentImport,fragment1:decryptFragement1,fragment2:decryptFragement2 });
        const w:any = forelet.getWidget(WIDGET_NAME);
        if (w) {
            w.ok && w.ok();
        }
    }
}