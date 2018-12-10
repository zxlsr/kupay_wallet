/**
 * 输入框的逻辑处理
 * {input:"",placehold:"",disabled:false,clearable:false,itype:"text",style:"",autofacus:false}
 * input?: 初始内容
 * placeHolder?: 提示文字
 * disabled?: 是否禁用
 * clearable?: 是否可清空
 * itype?: 输入框类型 text number password
 * style?: 样式
 * 外部可监听 ev-input-change，ev-input-blur，ev-input-focus，ev-input-clear事件
 */
import { getLang } from '../../../pi/util/lang';
import { notify } from '../../../pi/widget/event';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    available:boolean;// 输入的内容是否可用,false 后缀显示叉 true显示勾
    input?:string;
    placeHolder?:string;
    clearable?:boolean;
    itype?:string;
    style?:string;
    autofocus?:boolean;
}

interface State {
    currentValue:string;
    focused:boolean;
    showClear:boolean;
}
export class SuffixInput extends Widget {
    public props: any;
    constructor() {
        super();
    }
    public create() {
        this.props = {
            currentValue:'',
            focused: false,
            showClear:false
        };
    }
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props,oldProps);
        if (props.placeHolder) {
            this.props = {
                ...this.props,
                currentValue:'',
                focused: false,
                showClear:false,
                placeHolder : this.props.placeHolder[getLang()]
            };
        }
        if (props.input) {
            this.props = {
                ...this.props,
                focused: false,
                showClear:false,
                currentValue : props.input
            };
        }
    }

    public change(event:any) {
        const currentValue = event.currentTarget.value;
        this.props.currentValue = currentValue;
        this.props.showClear = this.props.clearable && this.props.currentValue !== '' && this.props.focused;
        
        notify(event.node,'ev-input-change',{ value:this.props.currentValue });
        this.changeInputValue();
        this.paint();
    }
    public blur(event:any) {
        this.props.focused = false;
        notify(event.node,'ev-input-blur',{});
        this.paint();
    }
    public focus(event:any) {
        this.props.focused = true;
        notify(event.node,'ev-input-focus',{});
        this.paint();
    }
    
    // 清空文本框
    public clearClickListener(event:any) {
        if (this.props.available) return;
        this.props.currentValue = '';
        this.props.showClear = false;
        notify(event.node,'ev-input-clear',{});
        this.changeInputValue();
        this.paint();
    }

    // 设置input value
    public changeInputValue() {
        const child = (<any>this.tree).children[0];
        const childNode = getRealNode(child);
        (<any>childNode).value = this.props.currentValue;
    }
}
