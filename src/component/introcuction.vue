<template>
    <div>
        <mu-card style="overflow: hidden">

            <mu-card-header title="风之筝">
                <mu-avatar src="http://114.55.102.93:8080/image/profile.jpg" slot="avatar"/>
            </mu-card-header>

            <mu-divider shallowInset=""></mu-divider>

           <div style="padding: 0 10px">

               <mu-card-title title="这是什么?" subTitle=" Kotoumi个人数据站"/>
               <mu-card-text>
                   这是 <a href="http://ll.sdo.com" target="_blank">LoveLive! 学园偶像祭 (国服)</a> 的数据收集应用，
                   前身是<a href="http://pll.sokka.cn" target="_blank">LLproxy</a>。
                   <br>
                   目前可以收集个人信息和Live信息，后续会开发并加入更多的功能。
                   <br>
               </mu-card-text>

               <mu-card-title title="使用方法" subTitle="Docs"/>
               <mu-card-text>
                   原理：将SIF流量通过代理服务器，代理服务器截取并分析。
                   <br>
                   使用方法：将网络的DNS设置到<code>114.55.102.93</code>。注意不同的WLAN以及流量均需要单独设置。
                   之后重启游戏即可。
               </mu-card-text>

               <mu-card-title title="其他要说的" subTitle=""/>
               <mu-card-text style="margin-bottom: 20px">
                   感谢 LLproxy@大众脸的同学 在<a href="https://github.com/EHfive/LLproxy-api" target="_blank">github</a>上的
                   <a href="http://114.55.102.93:8080/docs/LICENSE" target="_blank">开源</a>。
                   <br>
                   如有问题，欢迎随时向我反馈，贴吧ID：风之筝3809
               </mu-card-text>
           </div>
        </mu-card>
    </div>
</template>
