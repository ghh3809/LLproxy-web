<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
        </mu-card>
        <mu-card class="loading" v-else-if="loadingapi">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="lives" style="padding: 15px 0">

            <mu-card-title title="Live" subTitle="被收录的live（点击歌曲名或活动名进行筛选）" style=""></mu-card-title>
            <div style="text-align: right">
                <mu-text-field style="text-align: left; margin-right: 15px" v-model="keyword" hint-text="歌曲名/活动名" icon="search" @keydown.enter.native="search_live()"></mu-text-field>
                <mu-raised-button @click="search_live()" secondary="" style="margin-right: 15px">筛选</mu-raised-button>
                <mu-raised-button @click="goto_live()" secondary="" style="margin-right: 15px">重置</mu-raised-button>
            </div>
            <mu-divider></mu-divider>
            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false"
                          height="560px">
                    <mu-thead slot="header" class="tbth">
                        <mu-th class="wtcover">封面</mu-th>
                        <mu-th class="wtmap">谱面/完成时间</mu-th>
                        <mu-th class="wtscore">分数</mu-th>
                        <mu-th class="wtcombo">连击数/总数</mu-th>
                        <mu-th class="wtnotes">P/Gr/G/B/M P率</mu-th>
                        <mu-th class="wtper">活动</mu-th>
                        <mu-th class="wtper">详情</mu-th>
                    </mu-thead>
                    <mu-tbody>
                        <mu-tr v-for="(live,index) in lives" :key="index" :class="live['ap']?'live-ap':(live['fc']?'live-fc':'')" >
                            <mu-td @click="play_sound(live)">
                                <mu-badge class="demo-badge-content cursor-pointer" >
                                    <mu-avatar :src="getlive_iconsrc(live)" :size="50"></mu-avatar>
                                </mu-badge>
                            </mu-td>

                            <mu-td class="cursor-pointer" @click="goto_live(live['live_setting_id'])">
                                <span>{{getmapname(live)}}</span>
                                <br>
                                <span style="font-size: 85%">{{ live['update_time'].replace(new Date().getFullYear() + '-', "").replace('201', "1").replace('202', "2").replace("T", " ")}}</span>
                            </mu-td>

                            <mu-td>{{live['score']}}</mu-td>

                            <mu-td>
                                <span>{{live['max_combo']}}</span>
                                <span>{{getcombostring(live)}}</span>
                                <br>
                                <span style="font-size: 85%">{{"COMBO: " + getcombolevel(live)}}</span>
                            </mu-td>

                            <mu-td>
                                <span>{{getdetailstring(live)}}</span>
                                <br>
                                <span style="font-size: 85%">{{getpercent(live)}}</span>
                            </mu-td>

                            <mu-td class="cursor-pointer" @click="goto_live(undefined, live['event_id'])">
                                {{live['event_name'] || ("event: " + live['event_id'])}}
                            </mu-td>
                            <mu-td class="cursor-pointer" @click="goto_detail(live)">
                                <mu-icon value="navigate_next"></mu-icon>
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
                loadingapi: true,
                lives: null,
                page: 1,
                limit: 15,
                count: null,
                error: null,
                keyword: ""
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
            goto_live(setid, eventid) {
                this.keyword = "";
                this.$router.push({
                    path:this.$route.path,
                    query:{
                        setid: (setid === null) ? undefined : setid,
                        eventid: (eventid === null) ? undefined : eventid
                    }
                })
            },
            goto_detail(live) {
                this.$router.push({
                    path:this.$route.path.replace("live", "livedetail") + "/" + live['id']
                })
            },
            search_live() {
                this.$router.push({
                    path:this.$route.path,
                    query:{
                        keyword: (this.keyword === null || this.keyword === "") ? undefined : this.keyword,
                    }
                })
            },
            handlepage (newIndex) {
                this.page = newIndex;
                this.fetchData(false);
                document.getElementsByClassName('mu-table')[0].parentElement.scrollTop = 0
            },

            fetchData (reload = true) {

                reload && (this.loadingapi = true);
                const vm = this;
                axios.get(util.api_server + 'llproxy/liveInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        limit: vm.limit,
                        page: vm.page,
                        setid: vm.$route.query.setid === null ? undefined : vm.$route.query.setid,
                        eventid: vm.$route.query.eventid === null ? undefined : vm.$route.query.eventid,
                        keyword: vm.$route.query.keyword === null ? undefined : vm.$route.query.keyword
                    }
                })
                    .then(function (response) {

                        vm.lives = response.data['result']['lives'];
                        vm.page = response.data['result']['curr_page'];
                        vm.limit = response.data['result']['limit'];
                        vm.count = response.data['result']['count'];
                        reload && (vm.loadingapi = false);

                    })
                    .catch(function (err) {
                        this.error = err.toString();
                        console.log(err);
                    });

                axios.get(util.api_server + 'llproxy/userInfo/', {
                    params: {
                        uid: vm.$route.params.id,
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
                    const difficulty_list = ["", "EASY", "NORMAL", "HARD", "EXPERT", "EXPERT", "MASTER"];
                    return live['name'] + (live['is_random'] ? "(随机)" : "") + (live['ac_flag'] === 1 ? "(街机)" : "") +
                        (live['swing_flag'] === 1 ? "(滑键)" : "") +
                        " [" + difficulty_list[live['difficulty']] + "/" + live['stage_level'] + "]";
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
        padding: 2px;
        margin-top: 10px;

        .mu-badge {
            background-color: inherit;
            color: inherit;
        }

    }

    .mu-td, .mu-th {
        padding-left: 16px;
        padding-right: 5px;
        text-align: center;
        white-space: normal;
    }

    .livetable {
        width: auto;
        text-align: center;
    }

    .live-fc {
        background-color: rgba(253, 239, 255, 0.65);
    }

    .live-ap {
        background-color: rgba(251, 223, 255, 0.9);
    }

    .tbth {

    }

    .wtmap {
        width: 150px;
    }

    .wtcover {
        width: 80px;
    }

    .wtcombo {
        width: 60px;
    }

    .wtnotes {
        width: 120px;
    }

    .wtper {
        width: 60px;
    }

    .wtscore {
        width: 60px;
    }
    .cursor-pointer {
        cursor: pointer;
    }
</style>
