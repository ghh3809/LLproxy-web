<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="live" style="padding: 15px 0">

            <mu-card-title title="Live详情" subTitle="Live详细信息" style=""></mu-card-title>
            <mu-divider></mu-divider>
            <div class="content-info">
                <mu-card-title title="Live信息" subTitle="Info" class="mt8" />
                <mu-card-text>
                    <mu-flexbox>
                        <mu-flexbox-item class="flex-demo">
                            <div style="text-align: center">
                                <img :src="getlive_iconsrc(live)" :alt="live['name']" style="width: 150px; height: 150px">
                                <br>
                                <img :src="util.asset_root + live['title_asset']" :alt="live['name']" style="height: 30px" v-if="live['title_asset']">
                                <br>
                                <audio controls style="height: 30px; width: 250px; margin-top: 15px" v-if="live['sound_asset']">
                                    <source :src="util.asset_root + live['sound_asset']" type="audio/mpeg">
                                    您的浏览器不支持该音频格式。
                                </audio>
                            </div>

                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            <table>
                                <tr>
                                    <td class="list-title">歌曲名：</td>
                                    <td>{{getmapname(live)}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">难度：</td>
                                    <td>{{getmapdifficulty(live)}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">分数：</td>
                                    <td>{{live['score']}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">COMBO：</td>
                                    <td>{{live['max_combo'] + getcombostring(live) + " (COMBO: " + getcombolevel(live) + ")"}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">P/Gr/G/B/M：</td>
                                    <td>{{getdetailstring(live)}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">P率：</td>
                                    <td>{{getpercent(live)}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">完成时间：</td>
                                    <td>{{live['update_time']}}</td>
                                </tr>
                                <tr>
                                    <td class="list-title">所属活动：</td>
                                    <td>{{live['event_name'] || ("event: " + live['event_id'])}}</td>
                                </tr>
                            </table>
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-card-text>
                <mu-card-title title="Live奖励" subTitle="Reward" class="mt8" />
                <mu-card-text>
                    <mu-flexbox style="margin-left: 20px">
                        <mu-flexbox-item class="flex-demo">
                            <img :src="util.asset_root+'assets/image/ui/common/com_icon_03.png'" alt="金币">
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{live['game_coin_cnt']}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            <img :src="util.asset_root+'assets/image/ui/item/com_icon_32.png'" alt="友情pt">
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{live['social_point_cnt']}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                    <mu-flexbox style="margin-left: 20px">
                        <mu-flexbox-item class="flex-demo">
                            <p class="exp">EXP</p>
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{live['exp_cnt']}}
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            <p class="love">绊点</p>
                        </mu-flexbox-item>
                        <mu-flexbox-item class="flex-demo">
                            {{live['love_cnt']}}
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-card-text>
                <mu-card-title title="队伍信息" subTitle="Units" class="mt8"/>
                <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold">*队伍信息可用于<a href='http://llhelper.com/llnewunit'>LLHelper-队伍强度、得分计算</a>，孔数均为默认孔数。</p>
                <mu-card-text v-if="live['unit_list']">
                    <div>
                        <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false" height="auto">
                            <mu-tbody>
                                <mu-tr>
                                    <td class="wt10" v-for="unit in live['unit_list']">
                                        <mu-badge class="demo-badge-content" circle="" color="redA100" v-if="unit['unit_id']"
                                                  :content="unit['level'].toString()">
                                            <mu-avatar class="avatar" :src="getavatarsrc(unit)" :size="55"></mu-avatar>
                                        </mu-badge>
                                        <mu-badge class="demo-badge-content" v-else>
                                            <mu-avatar class="avatar" :src="getavatarsrc(unit)" :size="55"></mu-avatar>
                                        </mu-badge>
                                        <br>
                                        <div style="font-size: 75%" v-if="unit">
                                            {{unit.unit_skill_level}}级
                                        </div>
                                    </td>
                                    <td style="width: 10px"></td>
                                </mu-tr>
                            </mu-tbody>
                        </mu-table>
                    </div>
                    <div style="text-align: center; margin-top: 20px">
                        <mu-raised-button @click="export_units()" secondary="" class="demo-flat-button"
                                          labelPosition="before" icon="import_export" label="导出队伍"></mu-raised-button>
                    </div>
                </mu-card-text>
                <mu-card-text style="text-align: center" v-else>暂无收录的队伍信息</mu-card-text>

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
                loadingapi: true,
                error: null,
                util: util,
                live: null
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
            '$route': 'fetchData'
        },

        methods: {
            export_units() {
                let uri = "llproxy/liveUnitsExport/?id=" + this.$route.params.liveid;
                if (Cookies.get('dbLocalize') === 'JP') {
                    uri += "&lang=JP";
                } else {
                    uri += "&lang=CN";
                }
                window.open(util.api_server + uri);
            },
            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/liveDetail/', {
                    params: {
                        id: vm.$route.params.liveid,
                        lang: Cookies.get('dbLocalize')
                    }
                })
                    .then(function (response) {

                        vm.live = response.data['result']['live'];
                        reload && (vm.loadingapi = false);

                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err);
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
            getlive_iconsrc(live) {
                const hosts = util.asset_root;
                if (live && live['live_icon_asset']) {
                    return hosts + live['live_icon_asset']
                } else {
                    return hosts + "assets/image/ui/common/com_win_22.png";
                }

            },
            getmapname(live) {
                if (live['live_setting_id']) {
                    return live['name'] + (live['is_random'] ? " (随机)" : "") + (live['ac_flag'] === 1 ? " (街机)" : "") +
                        (live['swing_flag'] === 1 ? " (滑键)" : "")
                } else {
                    return live['live_difficulty_id'] ? "id: " + live['live_difficulty_id'] : "未识别曲目";
                }
            },
            getmapdifficulty(live) {
                if (live['live_setting_id']) {
                    const difficulty_list = ["", "EASY", "NORMAL", "HARD", "EXPERT", "EXPERT", "MASTER"];
                    return  difficulty_list[live['difficulty']] + " (" + live['stage_level'] + "★)";
                } else {
                    return live['live_difficulty_id'] ? "id: " + live['live_difficulty_id'] : "未识别曲目";
                }
            },
            getcombostring(live) {
                return live['ap'] ? " AP " : (live['fc'] ? " FC " : '/' +
                    (live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] +
                        live['bad_cnt'] + live['miss_cnt']));
            },
            getcombolevel(live) {
                const total_combo = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] +
                    live['bad_cnt'] + live['miss_cnt'];
                if (live['max_combo'] < total_combo * 0.3) {
                    return "-";
                } else if (live['max_combo'] < total_combo * 0.5) {
                    return "C";
                } else if (live['max_combo'] < total_combo * 0.7) {
                    return "B";
                } else if (live['max_combo'] < total_combo) {
                    return "A";
                } else {
                    return "S";
                }
            },
            getdetailstring(live) {
                return live['perfect_cnt'] + "/" + live['great_cnt'] + "/" + live['good_cnt'] + "/" +
                    live['bad_cnt'] + "/" + live['miss_cnt'];
            },
            getpercent(live) {
                const p = live['perfect_cnt'];
                const combo_all = live['perfect_cnt'] + live['great_cnt'] + live['good_cnt'] + live['miss_cnt'] + live['bad_cnt'];
                return (Math.round(p / combo_all * 1000) / 10.0 + "%")
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
            }

        }
    }
</script>

<style type="less">
    .loading {
        padding: 120px;
        text-align: center;
    }

    .mt8 {
        margin-top: 8px;
    }

    .list-title {
        font-weight: bold;
        color: deeppink;
    }

    .exp {
        color: white;
        text-shadow: 0 0 .3em aqua, 0 0 .1em blue;
        font-size: 15px;
        margin-left: 7px;
    }

    .love {
        color: white;
        text-shadow: 0 0 .3em deeppink, 0 0 .1em purple;
        font-size: 15px;
        margin-left: 7px;
    }

    .livetable {
        width: auto;
    }
</style>
