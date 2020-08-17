<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="logs" style="padding: 15px 0">

            <mu-card-title title="奖励箱" subTitle="live 奖励宝箱" style=""></mu-card-title>

            <mu-content-block style="margin-left: 10px">
                <mu-switch label="仅看蛋" v-model="limited"></mu-switch>
            </mu-content-block>

            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="true" height="auto">
                    <mu-thead slot="header">
                        <mu-th class="wtcardpool">奖励箱/大小</mu-th>
                        <mu-th>物品1</mu-th>
                        <mu-th>物品2</mu-th>
                        <mu-th>物品3</mu-th>
                        <mu-th>开箱时间</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(log,index) in logs" :key="index" :class="log['limited_effort_event_id']?'limited-box':''">

                            <mu-td class="wtcardpool ht70" style="text-align: center;">
                                <img v-if="log['limited_effort_event_id']" :src="getavatarsrc(log.asset)" alt="" style="height: 50px">
                                <img v-else :src="getavatarsrc(log.asset)" alt="" style="height: 30px">
                                <br>
                                <span>{{('' + log['capacity']).slice(0, -4) + '万'}}</span>
                            </mu-td>

                            <mu-td class="ht70" v-for="n in 3" :key="n-1">
                                <template v-if="log.rewards[n-1]">
                                    <img :src="getavatarsrc(log.rewards[n-1].asset)" alt="" style="height: 30px">
                                    <br>
                                    <span>{{log.rewards[n-1].name ? log.rewards[n-1].name : ("[item: " + log.rewards[n-1]['item_id'] + "]")}} × {{log.rewards[n-1].amount}}</span>
                                </template>
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
                util:util,
                limited: false
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
            'limited': 'changetype'
        },

        methods: {
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[1].parentElement.scrollTop = 0
            },
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/effortBoxLog/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        limited: this.limited ? 1 : undefined,
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
