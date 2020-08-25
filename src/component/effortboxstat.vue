<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="result" style="padding: 15px 0">

            <mu-card-title title="奖励箱统计" :subTitle="showall ? '统计了所有接入本站的奖励箱' : '统计了各奖励箱的概率分布'" style=""></mu-card-title>
            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold">* 最后一次开箱信息更新于：<span style="color: deeppink">{{update_time}}</span></p>

            <mu-content-block style="margin-left: 10px">
                <mu-switch :label="gettypelabel()" v-model="limited"></mu-switch>
                <mu-switch label="查看全员" v-model="showall" style="margin-left: 30px"></mu-switch>
            </mu-content-block>

            <div>
                <template v-for="box in result">
                    <mu-divider></mu-divider>
                    <mu-card-text class="card-text">箱子大小：<span class="card-text-em">{{box['capacity'] / 10000 + '万'}}</span>，总开箱数：<span class="card-text-em">{{box['count']}}</span></mu-card-text>
                    <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true" height="auto">
                        <mu-thead slot="header">
                            <mu-th>图例</mu-th>
                            <mu-th>类别</mu-th>
                            <mu-th>出现次数</mu-th>
                            <mu-th>比例</mu-th>
                        </mu-thead>
                        <mu-tbody>
                            <mu-tr v-for="(item, index) in box['items']" :key="index">
                                <mu-td><img :src="getavatarsrc(item['asset'])" alt="" style="height: 30px"></mu-td>
                                <mu-td>{{item['category']}}</mu-td>
                                <mu-td>{{item['amount']}}</mu-td>
                                <mu-td>{{item['ratio']}}</mu-td>
                            </mu-tr>
                        </mu-tbody>
                    </mu-table>
                </template>
            </div>
        </mu-card>

    </div>
</template>

<script>
    import axios from 'axios'
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: false,
                result: null,
                update_time: null,
                error: null,
                util: util,
                limited: false,
                showall: false
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
            'limited': 'changetype',
            'showall': 'changetype'
        },

        methods: {
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/effortBoxStat/', {
                    params: {
                        uid: this.showall ? 0 : vm.$route.params.id,
                        limited: this.limited ? 1 : undefined,
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.result = response.data['result']['stats'];
                        vm.update_time = response.data['result']['update_time'];
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)
                    })

            },
            getavatarsrc(asset) {
                if (asset) {
                    return util.asset_root + asset;
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png";
                }
            },
            changetype() {
                this.fetchData(false);
            },
            gettypelabel() {
                if (this.limited) {
                    return "切换 箱子";
                } else {
                    return "切换 蛋";
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
        padding: 10px 10px 5px 16px;
        text-align: center;
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

    .ht70 {
        height: 80px ;
    }

    .tr-notbypt {
        height: 65px;
    }

    .livetable {
        width: auto;
        text-align: center;
    }

    .wtcardpool {
        width: 20%;
    }

    .wtavatar {
        width: 40%;
    }

    .wtavatar-bypt {
        width: 50%;
    }

    .skill {
        max-width: 25px;
    }

    .limited-box {
        background-color: rgba(253, 239, 255, 0.65);
    }

    .card-text {
        text-align: center;
        font-size: 120%;
    }

    .card-text-em {
        text-align: center;
        font-size: 120%;
        color: deeppink;
    }
</style>
