/**
 * setting
 */
// =============================================导入
import { Widget } from '../../../../pi/widget/widget';
import { register, find, updateStore } from '../../../store/store';
import { Forelet } from '../../../../pi/widget/forelet';
import { LockScreen } from '../../../store/interface';
import { popNew } from '../../../../pi/ui/root';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Setting extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create(){
        const ls = find('lockScreen');
        this.state = {
            lockScreenPsw:ls.psw,
            openLockScreen: ls.psw && ls.open !== false,
            lockScreenTitle: '',
            numberOfErrors: 0,
            errorTips: ['请输入原来的密码', '已错误1次，还有两次机会', '最后1次，否则密码将会重置']
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange() {
        this.state.openLockScreen = !this.state.openLockScreen;
        const ls = find('lockScreen');
        ls.open = this.state.openLockScreen;
        updateStore('lockScreen',ls);
        this.paint();
    }

    /**
     * 更新锁屏密码
     */
    public updateLockScreen(ls:LockScreen) {
        this.state.lockScreenPsw = ls.psw;
        this.state.openLockScreen = ls.open;
        this.paint();
    }
}
register('lockScreen',(ls:LockScreen) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateLockScreen(ls);
    }
});