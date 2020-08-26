<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs" style="padding: 15px 0">

            <mu-card-title title="百人协力奖励" subTitle="记录了成功结算的百人协力的奖励" style=""></mu-card-title>

            <mu-raised-button @click="goto_stat()" secondary="" style="margin-left: 30px" label="查看统计"></mu-raised-button>

            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true" height="auto">
                    <mu-thead slot="header">
                        <mu-th>完成等级</mu-th>
                        <mu-th>连击等级</mu-th>
                        <mu-th>完成奖励</mu-th>
                        <mu-th>分数奖励</mu-th>
                        <mu-th>连击奖励</mu-th>
                        <mu-th>开箱时间</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(log,index) in logs" :key="index" style="height: 80px">

                            <mu-td>
                                {{getrankstring(log['score_rank'])}}
                            </mu-td>

                            <mu-td>
                                {{getcombostring(log['combo_rank'])}}
                            </mu-td>

                            <mu-td>
                                <div v-if="log['live_clear']">
                                    <img :src="getavatarsrc(log['live_clear'].asset)" alt="" style="height: 30px">
                                    <br>
                                    <span>{{log['live_clear'].name ? log['live_clear'].name : ("[item: " + log['live_clear']['item_id'] + "]")}} × {{log['live_clear'].amount}}</span>
                                </div>
                            </mu-td>

                            <mu-td>
                                <div v-if="log['live_rank']">
                                    <img :src="getavatarsrc(log['live_rank'].asset)" alt="" style="height: 30px">
                                    <br>
                                    <span>{{log['live_rank'].name ? log['live_rank'].name : ("[item: " + log['live_rank']['item_id'] + "]")}} × {{log['live_rank'].amount}}</span>
                                </div>
                            </mu-td>

                            <mu-td>
                                <div v-if="log['live_combo']">
                                    <img :src="getavatarsrc(log['live_combo'].asset)" alt="" style="height: 30px">
                                    <br>
                                    <span>{{log['live_combo'].name ? log['live_combo'].name : ("[item: " + log['live_combo']['item_id'] + "]")}} × {{log['live_combo'].amount}}</span>
                                </div>
                            </mu-td>

                            <mu-td>
                                {{ log['open_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace("T", " ")}}
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

    export default {
        data(){
            return {
                loadingapi: false,
                logs: null,
                page: 1,
                limit: 10,
                count: null,
                error: null,
                util: util,
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
        },

        methods: {
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[1].parentElement.scrollTop = 0
            },
            goto_stat() {
                this.$router.push({
                    path:this.$route.path.replace("duellivebox", "duelliveboxstat")
                })
            },
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/duelLiveBoxLog/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.logs = response.data['result']['boxes'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count']
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)

                    })

            },
            getrankstring(rank) {
                const rank_list = ['', 'S(100~119%)', 'A(70~99%)', 'B(50~69%)', 'C(30~49%)', '-(0~29%)', 'SS(120~149%)', 'SSS(150~199%)', 'SSS Ⅰ(200~299%)', 'SSS Ⅱ(300~449%)', 'SSS Ⅲ(450~599%)', 'SSS Ⅳ(600~999%)'];
                return rank_list[rank];
            },
            getcombostring(rank) {
                const rank_list = ['', 'COMBO: S', 'COMBO: A', 'COMBO: B', 'COMBO: C', 'COMBO: -'];
                return rank_list[rank];
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
            }
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
</style>
