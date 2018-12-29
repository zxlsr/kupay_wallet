<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-next-click="goHistory">
    {{: topBarTitle = {"zh_Hans":"大转盘","zh_Hant":"大轉盤","en":""} }}
    <app-components1-topBar-topBar2>{scrollHeight:0,text:{{topBarTitle}},nextImg:"../../res/image/26_white.png" }</app-components1-topBar-topBar2>
    <div w-class="content">
        <div w-class="center flex-col">
            {{% 大转盘}}
            <img src="../../res/image/pan-bg0.png" width="628px;"/>

        </div>

        {{% 下面选票}}
        <div w-class="bottom flex-col">

            {{% 售价}}
            <div w-class="sale">
                <div w-class="sale-money">
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"售价：2","zh_Hant":"售價：2","en":""}</widget>
                    {{if it.selectTicket===0}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"银券","zh_Hant":"銀券","en":""}</widget>
                    {{elseif it.selectTicket===1}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"金券","zh_Hant":"金券","en":""}</widget>
                    {{elseif it.selectTicket===2}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"彩券","zh_Hant":"彩券","en":""}</widget>
                    {{end}}
                    <widget w-tag="pi-ui-lang">{"zh_Hans":"/1个","zh_Hant":"/1個","en":""}</widget>
                </div>
            </div>

            {{% 余票}}
            <div w-class="ticket">
                <div on-tap="change(0)" w-class="ticket-item {{it.selectTicket===0?'select':''}}">
                    <img src="../../res/image/silverTicket1.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
                <div on-tap="change(1)" w-class="ticket-item {{it.selectTicket===1?'select':''}}">
                    <img src="../../res/image/goldTicket1.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
                <div on-tap="change(2)" w-class="ticket-item {{it.selectTicket===2?'select':''}}">
                    <img src="../../res/image/diamondTicket1.png" width="100%;" style="margin-top:15px;" />
                    <div w-class="ticket-num">0</div>
                </div>
            </div>
        </div>



    </div>
</div>