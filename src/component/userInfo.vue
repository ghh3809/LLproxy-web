<template>
    <div>


        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <pre>{{error}}</pre>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7" />
        </mu-card>
        <mu-card v-else-if="userinfo" style="overflow: hidden">
            <mu-card-header :title="userinfo.name" :subTitle="'Rank. '+userinfo.level">
                <img :src="getasset(userinfo['award_asset'])" alt="" height="60px" slot="avatar">
                <mu-avatar :src="getavatarsrc()" slot="avatar" :size="60"></mu-avatar>
                <p style="font-size: 70%; color: gray">*头像未显示时，可在游戏中查看个人资料进行刷新</p>
                <div>

                    <mu-flexbox style="margin-top: 1em">
                        <mu-flexbox-item>
                            <mu-linear-progress :min="userinfo['previous_exp']" :max="userinfo['next_exp']"
                                                :value="userinfo['exp']" mode="determinate"
                                                color="lightGreenA700"></mu-linear-progress>

                        </mu-flexbox-item>
                        <mu-flexbox-item style="margin-left: 20px">
                            EXP: {{(userinfo['exp'] - userinfo['previous_exp']) + ' /' + (userinfo['next_exp'] - userinfo['previous_exp'])}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <mu-flexbox style="margin-top: 0.5em">
                        <mu-flexbox-item>
                            <mu-linear-progress :min="0" :max="userinfo['energy_max']"
                                                :value="userinfo['energy_max'] - lefttime / 360000" mode="determinate"
                                                color="yellow600"></mu-linear-progress>
                        </mu-flexbox-item>
                        <mu-flexbox-item style="margin-left: 20px">

                            LP: {{((( userinfo['over_max_energy'] === 0 && lefttime >= 0 ) ?
                            parseInt(userinfo['energy_max'] - lefttime / 360000) : userinfo['over_max_energy'])) + ' /'
                            + userinfo['energy_max']}}
                            <span style=""
                                  v-if="lefttime>0">还有{{parseInt(lefttime / 60000 / 60) + ':' + pad(parseInt(lefttime / 60000 % 60), 2) + ':' + pad(parseInt(lefttime / 1000 % 60), 2)}}</span>

                        </mu-flexbox-item>
                    </mu-flexbox>

                </div>
            </mu-card-header>
            <mu-divider></mu-divider>
            <div class="content-info">
                <mu-card-title title="一些道具" subTitle="Loveca/Coin/友情pt" class="mt8" />
                <mu-card-text>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            <img :src="util.asset_root+'assets/image/ui/common/com_icon_04.png'" alt="loveca">
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['sns_coin'] + ' (有偿 ' + userinfo['paid_sns_coin'] + ')'}}
                        </mu-flexbox-item>

                        <mu-flexbox-item class="flex-demo">
                            <img :src="util.asset_root+'assets/image/ui/common/com_icon_03.png'" alt="金币">
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['game_coin']}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            <img :src="util.asset_root+'assets/image/ui/item/com_icon_32.png'" alt="友情pt">
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['social_point']}}
                        </mu-flexbox-item>

                        <mu-flexbox-item />

                        <mu-flexbox-item />
                    </mu-flexbox>
                </mu-card-text>
                <mu-card-title title="基本信息" subTitle="Info" class="mt8"/>
                <mu-card-text>
                    <mu-flexbox class="">
                        <mu-flexbox-item class="flex-demo">
                            User ID
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['user_id']}}
                        </mu-flexbox-item>
                        <mu-flexbox-item />

                    </mu-flexbox>
                    <mu-flexbox class="mt8">
                        <mu-flexbox-item class="flex-demo">
                            邀请 ID
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['invite_code']}}
                        </mu-flexbox-item>
                        <mu-flexbox-item />
                    </mu-flexbox>
                    <!--<mu-flexbox class="mt8">-->
                    <!--<mu-flexbox-item class="flex-demo">-->
                    <!--好友上限-->
                    <!--</mu-flexbox-item>-->
                    <!--<mu-flexbox-item class="flex-demo">-->
                    <!--{{userinfo['friend_max']}}-->
                    <!--</mu-flexbox-item>-->
                    <!--<mu-flexbox-item/>-->
                    <!--</mu-flexbox>-->
                    <mu-flexbox class="mt8">
                        <mu-flexbox-item class="flex-demo">
                            账号创建时间
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['insert_date'].replace("T", " ")}}
                        </mu-flexbox-item>
                        <mu-flexbox-item />

                    </mu-flexbox>
                    <mu-flexbox class="mt8">
                        <mu-flexbox-item class="flex-demo">
                            账号信息最后更新于
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{userinfo['update_time'].replace("T", " ")}}
                        </mu-flexbox-item>
                        <mu-flexbox-item />
                    </mu-flexbox>
                </mu-card-text>

            </div>
        </mu-card>


    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'
    import Cookies from 'js-cookie'

    export default {
        data(){
            return {
                loadingapi: false,
                userinfo: null,
                error: null,
                flag: false,
                lefttime: 0,
                time: null,
                util:util
            }
        },
        mounted () {
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData();
            this.lp()

        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },

        methods: {

            pad(num, n){
                return (Array(n).join(0) + num).slice(-n);
            },
            fetchData () {
//                this.lefttime=0
                this.flag = false;
                this.time = setInterval(() => {
                    if (this.flag === true) {

                        clearInterval(this.time);
                        this.lefttime = 0
                    } else {
                        this.lp()
                    }

                }, 500);
                this.flag = false;
                this.error = this.userinfo = null;
                this.loadingapi = true;
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/userInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        lang: Cookies.get('dbLocalize')
                    }
                })
                    .then(function (response) {
                        vm.loadingapi = false;
                        vm.userinfo = response.data['result'];
                        if (vm.userinfo) {
                            vm.userinfo.uid = vm.userinfo['user_id'];
                            bus.$emit('update', vm.userinfo)
                        }
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getavatarsrc() {
                if (this.userinfo && this.userinfo['navi_unit_info'] && this.userinfo['navi_unit_info']['rank_max_icon_asset']) {
                    let asset_root = util.asset_root;
                    if (this.userinfo['navi_unit_info']['unit_number'] >= 10000) {
                        asset_root = util.asset_root2;
                    }
                    if (this.userinfo['navi_unit_info']['display_rank'] === 2) {
                        return asset_root + this.userinfo['navi_unit_info']['rank_max_icon_asset'];
                    } else {
                        return asset_root + this.userinfo['navi_unit_info']['normal_icon_asset'];
                    }
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png";
                }
            },
            getasset(asset) {
                if (asset) {
                    return util.asset_root + asset;
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png";
                }
            },
            lp () {
                if (this.userinfo) {
                    const thattime= (Date.parse(this.userinfo['energy_full_time'] + "+08:00") - Date.now());

                    if (thattime <= 0) {
                        this.flag = true;
                        this.lefttime = 0
                    } else {
                        this.lefttime = thattime
                    }
                }
                else return 0
            },

        }
    }
</script>

<style>
    .mt8 {
        margin-top: 8px;
    }

    .loading {
        padding: 120px;
        text-align: center;
    }

    /*.content-info{*/
    /*background:url('https://r.llsif.win/assets/image/units/u_normal_navi_41102001.png') no-repeat;*/
    /*background-position: 200% 70% ;*/
    /*!*background-origin: border-box;*!*/
    /*background-clip:content-box;*/
    /*!*background-attachment: fixed;*!*/
    /*background-size: 80%;*/

    /*}*/
</style>
