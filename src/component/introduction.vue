<template>
    <mu-card-text>
        <mu-card style="overflow: hidden">

            <mu-card-header title="风之筝" sub-title="一只来自海鸟阁的海鸟厨">
                <mu-avatar src="http://116.62.149.31/image/profile.jpg" slot="avatar"/>
            </mu-card-header>

            <mu-divider shallowInset=""></mu-divider>

           <mu-card-text style="padding: 0 10px">

               <mu-card-title title="这是什么?" subTitle=" 海鸟个人数据站"/>
               <mu-card-text>
                   这是 <a href="http://ll.sdo.com" target="_blank">LoveLive! 学园偶像祭 (国服)</a> 的数据收集应用，
                   前身是<a href="http://pll.sokka.cn" target="_blank">LLproxy</a>。
                   <br>
                   <br>
               </mu-card-text>

               <mu-card-title title="功能简介" subTitle=" Introduction"/>
               <mu-card-text>
                   <strong style="color: deeppink">个人信息</strong>：可以查看账号的基本信息、资源情况、账号创建时间等。<br>
                   <strong style="color: deeppink">队伍信息</strong>：查看编队情况，并支持导出LLHelper格式的json文件。<br>
                   <strong style="color: deeppink">社员信息</strong>：查看账号下SR以上社员的信息，并支持导出LLHelper格式的json文件。<br><br>
                   <strong style="color: deeppink">Live记录</strong>：详细记录了每次Live的时间、打歌详情等。<br>
                   <strong style="color: deeppink">招募记录</strong>：详细记录每次招募获得的社员信息。

               </mu-card-text>

               <mu-card-title title="使用方法" subTitle=" Docs"/>
               <mu-card-text>
                   <p style="color: red; font-weight: bold; margin-top: 0">注意：如果您接入数据收集，则表示您允许账号中的信息
                       （包括且不限于社员信息、打歌记录等）可被所有人搜索到。</p>
                   原理：将SIF流量通过代理服务器，代理服务器截取并分析。
                   <br>
                   使用方法：将网络的DNS设置到<code style="color: deeppink; font-weight: bold">114.55.102.93</code>（注意不同的WLAN需要单独设置）
                   ，然后重启游戏。设置原理上不影响设备正常上网，若您发现部分网页或应用无法打开，可以删除该DNS重试。
                   <br><br>
                   <code style="color: gray">
                   安卓 WLAN设置方法：设置 -> WLAN -> 网络详情 -> IP由DHCP设置为静态 -> 输入DNS
                   <br>
                   iOS WLAN设置方法：设置 -> Wi-Fi -> 网络详情 -> 配置DNS -> 更改为手动 -> 删除原有DNS，输入新的DNS
                   </code>
                   <br><br>
                   检查DNS是否设置成功：<a href="http://prod.game1.ll.sdo.com/kotoumi/">测试地址</a>，若可以正常访问，则表示设置成功。
                   <br><br>
                   若要停止使用，删除设置的DNS即可，之后您的数据将不会再被记录。
               </mu-card-text>

               <mu-card-title title="其他" subTitle=" Others"/>
               <mu-card-text style="margin-bottom: 20px">
                   感谢 LLproxy@大众脸的同学 在<a href="https://github.com/EHfive/LLproxy-api" target="_blank">github</a>上的
                   <a href="http://kotoumi.top/docs/LICENSE" target="_blank">开源</a>。如有问题，欢迎随时向我反馈。
                   <br>贴吧ID：<a href="https://tieba.baidu.com/home/main?un=%E9%A3%8E%E4%B9%8B%E7%AD%9D3809">风之筝3809</a>
                   <br>bilibili: <a href="https://space.bilibili.com/64501399">风之筝3809</a>
               </mu-card-text>

               <mu-card-title title="更新日志" subTitle=" Updates"/>
               <mu-card-text style="margin-bottom: 20px">
                   <div style="font-size: 150%">20200811</div>
                   <div style="margin-left: 30px">
                       <div>1. 支持在队伍信息/社员信息中，查看最近在live中上场的成员</div>
                       <div>2. 修复&优化了一些已知问题</div>
                   </div>
                   <br>
                   <div style="font-size: 150%">20200810</div>
                   <div style="margin-left: 30px">
                       <div>1. 支持切换数据语言（注：部分社员可能在日服语言下无法查看）（感谢<a href="https://card.niconi.co.ni">查卡器</a>和<a href="http://llsif.win/">SIFDB</a>提供的国/日服数据包）</div>
                       <div>2. 修复了社员数据导出异常的bug</div>
                   </div>
                   <br>
                   <div style="font-size: 150%">20200805</div>
                   <div style="margin-left: 30px">
                       <div>1. 增加live详情界面，可以查看live奖励及使用的卡组，并支持导出到LLHelper</div>
                       <div>2. 针对查看不到队伍信息的玩家，可以从打歌记录中获得相应的队伍信息（我终于看到队伍了，泪奔）</div>
                   </div>
               </mu-card-text>
           </mu-card-text>
        </mu-card>
    </mu-card-text>
</template>
