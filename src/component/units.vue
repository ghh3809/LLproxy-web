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

            <mu-card-title title="社员信息" subTitle="所有社员(SR及以上，仅已收录社员)" v-if="!islive"></mu-card-title>
            <mu-card-title title="社员信息" subTitle="最近30天参与过Live的社员" v-else></mu-card-title>
            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold">* 卡组信息可用于 <a target="_blank" href="http://llhelper.com/llnewautounit">LLHelper-自动组队</a></p>
            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold" v-if="!islive">**成员未显示时，可以通过打歌获取到成员信息，并切换至<span style="color: deeppink">live社员</span>查看</p>
            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold" v-else>**Live社员模式仅收集最近<span style="color: deeppink">30天内</span>在Live使用过的成员，同时无法显示孔数；
                导出时将统一按照<span style="color: deeppink">4孔</span>进行导出</p>

            <mu-switch :label="gettypelabel()" class="checkbox" v-model="islive"></mu-switch>
            <mu-checkbox label="包含SSR" class="checkbox" v-model="ssr"></mu-checkbox>
            <mu-checkbox label="包含SR" class="checkbox" v-model="sr"></mu-checkbox>
            <mu-checkbox label="包含预备教室" class="checkbox" v-model="back" v-if="!islive"></mu-checkbox>

            <mu-raised-button style="margin-left: 15px; margin-bottom: 15px" icon="import_export"
                              labelPosition="before" secondary=""
                              label="导出卡组JSON"
                              @click="export_units()"></mu-raised-button>

            <mu-divider></mu-divider>
            <div>
                <mu-table ref="infotable" :selectable="false" :showCheckbox="false" :fixedHeader="false" height="600px">
                    <mu-thead slot="header">
                        <mu-th class="mt-avatar">头像</mu-th>
                        <mu-th>成员名称</mu-th>
                        <mu-th>稀有度</mu-th>
                        <mu-th v-if="!islive">技能等级/槽数</mu-th>
                        <mu-th v-else>技能等级</mu-th>
                        <mu-th>绊</mu-th>
                        <mu-th>等级</mu-th>
                        <mu-th v-if="!islive">获得日期</mu-th>
                        <mu-th>数据更新于</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(unit,index) in units" :key="index">
                            <mu-td class="mt-avatar">

                                <mu-badge class="demo-badge-content" circle="" v-if="unit['is_rank_max']">
                                    <mu-avatar :src="getavatarsrc(unit)" :size="50"></mu-avatar>
                                    <mu-icon value="stars" slot="content" color="pinkA100" v-if="unit['is_love_max'] && unit['is_level_max']"></mu-icon>
                                    <mu-icon value="face" slot="content" color="green" v-else=""></mu-icon>
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
                            <mu-td>{{unit['unit_skill_level'] + "级" + (islive ? "" : (" / " + unit['unit_removable_skill_capacity'] + "孔"))}}</mu-td>
                            <mu-td>{{unit['love'] + "/" + unit['max_love']}}</mu-td>
                            <mu-td>{{unit['level'] + (islive ? "" : ("/" + unit['max_level']))}}</mu-td>
                            <mu-td v-if="!islive">{{unit['insert_date'].slice(0, -9)}}<br></mu-td>
                            <mu-td>{{unit['update_time'].slice(0, -9)}}</mu-td>

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
    import Cookies from 'js-cookie'

    export default {
        data(){
            return {
                loadingapi: false,
                units: null,
                page: 1,
                limit: 15,
                ssr: false,
                sr: false,
                back: false,
                islive: false,
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
            '$route': 'fetchData',
            'islive': 'changetype',
            'ssr': 'changetype',
            'sr': 'changetype',
            'back': 'changetype',
        },

        methods: {
            export_units() {
                let uri = "llproxy/unitsExport/?uid=" + this.$route.params.id +
                    (this.ssr ? "&ssr=1" : "") + (this.sr ? "&sr=1" : "") + (this.back ? "&back=1" : "");
                if (this.islive) {
                    uri += "&islive=1";
                }
                if (Cookies.get('dbLocalize') === 'JP') {
                    uri += "&lang=JP";
                } else {
                    uri += "&lang=CN";
                }
                window.open(util.api_server + uri);
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
                        page: vm.page,
                        ssr: vm.ssr ? 1 : undefined,
                        sr: vm.sr ? 1 : undefined,
                        back: (vm.back && !vm.islive) ? 1 : undefined,
                        islive: vm.islive ? 1 : undefined,
                        lang: Cookies.get('dbLocalize')
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

                    });

                axios.get(util.api_server + 'llproxy/userInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        lang: Cookies.get('dbLocalize')
                    }
                })
                    .then(function (response) {
                        bus.$emit('update', response.data['result'])
                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err)
                    })


            },
            getavatarsrc(unit) {
                if (unit && unit['rank_max_icon_asset']) {
                    let asset_root = util.asset_root;
                    if (unit['unit_number'] >= 10000) {
                        asset_root = util.asset_root2;
                    }
                    if (unit['display_rank'] === 2) {
                        return asset_root + unit['rank_max_icon_asset'];
                    } else {
                        return asset_root + unit['normal_icon_asset'];
                    }
                } else {
                    return util.asset_root + "assets/image/ui/common/com_win_22.png"
                }
            },
            gettypelabel() {
                if (this.islive) {
                    return "切换 普通社员";
                } else {
                    return "切换 live社员";
                }
            },
            changetype() {
                this.page = 1;
                this.fetchData(true);
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

    .checkbox {
        margin-left: 15px;
        vertical-align: middle;
    }
</style>
