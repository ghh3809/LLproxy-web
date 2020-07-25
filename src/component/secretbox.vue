<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs" style="padding: 15px 0">
            <!--<mu-card-header title="Myron Avatar" subTitle="sub title">-->
            <!--<mu-avatar src="/images/uicon.jpg" slot="avatar"/>-->
            <!--</mu-card-header>-->

            <mu-card-title title="招募" :subTitle="bypt?'普通生招募':'卡池招募'" style=""></mu-card-title>

            <mu-content-block style="margin-left: 10px">
                <mu-switch label="切换 普通生招募" v-model="bypt"></mu-switch>
                <mu-switch v-if="bypt" style="margin-left: 20px" label="显示 N" v-model="shown"></mu-switch>
                <mu-switch v-else style="margin-left: 20px" label="显示 R" v-model="showr"></mu-switch>
            </mu-content-block>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true"
                          :height="(logs.length>=10 || page>1)?'560px':'auto'">
                    <mu-thead slot="header">
                        <mu-th class="wtcardpool">卡池名称/时间</mu-th>

                        <mu-th v-if="!bypt">UR</mu-th>
                        <mu-th>SSR</mu-th>
                        <mu-th v-if="!bypt">SR</mu-th>
                        <mu-th>R</mu-th>
                        <mu-th v-if="bypt">N</mu-th>

                        <mu-th :class="bypt?'wtavatar-bypt':'wtavatar'">社员列表</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(log,index) in logs" :key="index" :class="bypt?'':'tr-notbypt'">
                            <mu-td class="wtcardpool ht60">
                                <span>{{log.name}}</span>
                                <br><span style="font-size: 85%">{{ log['pon_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}</span>
                            </mu-td>

                            <mu-td class="ht60" v-if="!bypt">{{log['ur_cnt']}}</mu-td>
                            <mu-td class="ht60">{{log['ssr_cnt']}}</mu-td>
                            <mu-td class="ht60" v-if="!bypt">{{log['sr_cnt']}}</mu-td>
                            <mu-td class="ht60">{{log['rare_cnt']}}</mu-td>
                            <mu-td class="ht60" v-if="bypt">{{log['normal_cnt']}}</mu-td>

                            <mu-td :class="bypt?'wtavatar-bypt':'wtavatar'+' ht60'">
                                <mu-avatar v-for="(unit,indexu) in log['units']" :key="indexu"
                                           :src="getavatarsrc(unit)"
                                           v-if="bypt?(shown || (unit['rarity'] !== 1)):(showr || (unit['rarity'] !== 2))"></mu-avatar>
                            </mu-td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
            </div>
            <mu-card-actions>
                <mu-pagination :total="count" :current="page" @pageChange="handlepage"
                               :defaultPageSize="limit">
                </mu-pagination>
            </mu-card-actions>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'

    const showrkey = "secretbox_showr";
    const shownkey = "secretbox_shown";
    export default {
        data(){
            return {
                loadingapi: false,
                logs: null,
                page: 1,
                limit: 10,
                count: null,
                error: null,
                bypt: false,
                showr: util.getkey(showrkey) === 'true',
                shown: util.getkey(shownkey) === 'true'
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData();
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
            'bypt': 'changept',
            'showr': 'handleshowr',
            'shown': 'handleshown'
        },

        methods: {
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[1].parentElement.scrollTop = 0
            },
            handleshowr (){
                util.setkey(showrkey, this.showr)
            },
            handleshown (){
                util.setkey(shownkey, this.shown)
            },
            changept(){
                this.page = 1;
                this.fetchData(false)
            },
            fetchData (reload = true) {

                this.error = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/secretBoxLog/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        type: this.bypt ? 1 : 0
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.logs = response.data['result']['logs'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count']
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getavatarsrc(unit) {
                if (unit && unit['rank_max_icon_asset']) {
                    if (unit['rank'] === 2) {
                        return util.asset_root + unit['rank_max_icon_asset'];
                    } else {
                        return util.asset_root + unit['normal_icon_asset'];
                    }
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            },

        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        height: 60px;
        white-space: normal;
    }

    .demo-badge-content {
        padding: 6px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .tr-notbypt {
        height: 65px;
    }

    .livetable {
        width: auto;
    }

    .wtcardpool {
        width: 20%;
    }

    .ht60 {
        height: 60px;
    }

    .wtavatar {
        width: 40%;
        text-align: left;
    }

    .wtavatar-bypt {
        width: 50%;
        text-align: left;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
