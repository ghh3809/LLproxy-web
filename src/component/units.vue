<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="units" style="padding: 15px 0">

            <mu-card-title title="社员信息" subTitle="所有社员(SR及以上，仅已收录社员)" style=""></mu-card-title>

            <mu-card-text>
                <mu-raised-button style="margin-left: 15px" icon="import_export"
                                  labelPosition="before" secondary=""
                                  label="导出卡组JSON"
                                  @click="export_llhelper()"></mu-raised-button>

                <span style="margin-left: 18px">JSON信息可用于 <a target="_blank" href="http://llhelper.com/llnewautounit">LLHelper-自动组队</a></span>
            </mu-card-text>
            <mu-divider></mu-divider>
            <div>
                <mu-table ref="infotable" :selectable="false" :showCheckbox="false" :fixedHeader="false" height="600px">
                    <mu-thead slot="header">
                        <mu-th class="mt-avatar">头像</mu-th>
                        <mu-th>成员名称</mu-th>
                        <mu-th>稀有度</mu-th>
                        <mu-th>技能等级/槽数</mu-th>
                        <mu-th>绊</mu-th>
                        <mu-th>等级</mu-th>
                        <mu-th>获得日期</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(unit,index) in units" :key="index">
                            <mu-td class="mt-avatar">

                                <mu-badge class="demo-badge-content" circle="" v-if="unit['is_rank_max']">
                                    <mu-avatar :src="getavatarsrc(unit)" :size="50"></mu-avatar>
                                    <mu-icon value="stars" slot="content" color="pinkA100" size="20" v-if="unit['is_love_max'] && unit['is_level_max']"></mu-icon>
                                    <mu-icon value="face" slot="content" color="green" size="20" v-else=""></mu-icon>
                                </mu-badge>
                                <mu-badge class="demo-badge-content" v-else>
                                    <mu-avatar :src="getavatarsrc(unit)" :size="50"></mu-avatar>
                                </mu-badge>
                            </mu-td>
                            <mu-td v-if="unit['name']">
                                <span>{{unit['name']}}</span>
                                <br>
                                <span style="font-size: 85%">{{unit['eponym']}}</span>
                            </mu-td>
                            <mu-td v-else>
                                {{"id: " + unit['unit_id']}}
                            </mu-td>
                            <mu-td>{{unit['rarity_string']}}</mu-td>
                            <mu-td>{{unit['unit_skill_level']}}级 / {{unit['unit_removable_skill_capacity']}}孔</mu-td>
                            <mu-td>{{unit['love'] + "/" + unit['max_love']}}</mu-td>
                            <mu-td>{{unit['level'] + "/" + unit['max_level']}}</mu-td>
                            <mu-td>{{ unit['insert_date'].slice(0, -9)}}</mu-td>


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
    import download from 'downloadjs/download.min'
    import bus from '../bus.js'
    import util from '../util.js'

    export default {
        data(){
            return {
                loadingapi: false,
                units: null,
                page: 1,
                limit: 15,
                count: null,
                error: null
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData();
            bus.$on('refresh', () => {

                this.fetchData()

            });
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },

        methods: {
            export_llhelper() {
                window.open(util.api_server + "llproxy/unitsExport/?uid=" + this.$route.params.id)
            },
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0

            },
            fetchData (reload = true) {
                this.error = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/unitsInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.units = response.data['result']['units'];
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
                    if (unit['display_rank'] === 2) {
                        return util.asset_root + unit['rank_max_icon_asset'];
                    } else {
                        return util.asset_root + unit['normal_icon_asset'];
                    }
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            }

        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .demo-badge-content {
        padding: 6px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .infotable {
        text-align: center;
        overflow: hidden;
    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        text-align: center;
        white-space: normal;
    }

    .mt-avatar {

    }
</style>
