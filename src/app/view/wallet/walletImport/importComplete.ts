/**
 * creation complete
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { find } from '../../../store/store';
export class CreateComplete extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        //
    }
    public backPrePage() {
        const ls = find('lockScreen');

        if (!ls.psw && !ls.jump) {
            popNew('app-view-mine-lockScreen-setLockScreen-setLockScreenScret', { jump: true });
        }
        this.ok && this.ok();
    }

}
