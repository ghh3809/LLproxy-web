<template>
    <div>
        <mu-card class="loading" v-if="error">
            <p>获取数据失败, 请重试或刷新, 或者并无记录</p>
            <!--<pre>{{error}}</pre>-->
        </mu-card>
        <mu-card v-else-if="loadingapi" class="loading">
            <mu-circular-progress :size="120" :strokeWidth="7"/>
        </mu-card>
        <mu-card v-else-if="decks" style="padding: 15px 0">

            <mu-card-title title="队伍" subTitle="当前队伍（点击队伍名可导出至LLHelper）" style=""></mu-card-title>

            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold">*队伍未显示时，更换下主力队伍并返回主页即可；
                成员未显示时，可以通过打歌获取到成员信息，但孔数将均被设置为<span style="color: deeppink">4孔</span></p>
            <p style="font-size: 70%; color: gray; margin-left: 15px; font-weight: bold">**队伍信息可用于<a href='http://llhelper.com/llnewunit'>LLHelper-队伍强度、得分计算</a>。
                由于LLHelper限制，未识别成员将使用1号成员<span style="color: deeppink">桜坂しずく</span>代替</p>

            <div>
                <mu-table class="livetable" :selectable="false" :showCheckbox="false" :fixedHeader="false" height="auto">

                    <mu-tbody>
                        <mu-tr :class="deck.main_flag ?'main-flag':false" v-for="(deck,index) in decks" :key="index">
                            <td class="wt100">
                                <mu-flat-button @click="export_deck(deck['unit_deck_id'])" :label="deck.deck_name"
                                                class="demo-flat-button" labelPosition="before" icon="import_export"
                                                secondary=""></mu-flat-button>
                            </td>
                            <td class="wt10" v-for="unit in deck.units">
                                <mu-badge class="demo-badge-content" circle="" color="redA100" v-if="unit['unit_id']"
                                          :content="unit['level'].toString()">
                                    <mu-avatar class="avatar" :src="getavatarsrc(unit)" :size="55"></mu-avatar>
                                </mu-badge>
                                <mu-badge class="demo-badge-content" v-else>
                                    <mu-avatar class="avatar" :src="getavatarsrc(unit)" :size="55"></mu-avatar>
                                </mu-badge>
                                <br>
                                <div style="font-size: 75%" v-if="unit['unit_id']">
                                    {{unit.unit_skill_level}}级 / {{unit.unit_removable_skill_capacity}}孔
                                </div>
                                <div style="font-size: 20%; text-align: center" v-else>
                                    {{'- / -'}}
                                </div>
                            </td>
                            <td style="width: 10px"></td>
                        </mu-tr>
                    </mu-tbody>
                </mu-table>
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
                decks: null,
                error:null
            }
        },
        created () {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData();
            // this.fetchMap();
            bus.$on('refresh', () => {

                this.fetchData()

            })
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData',
        },

        methods: {
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
            },
            fetchData (reload = true) {

                this.error = this.userinfo = null;
                reload && (this.loadingapi = true);
                // replace getPost with your data fetching util / API wrapper
                const vm = this;
                axios.get(util.api_server + 'llproxy/deckInfo/', {
                    params: {
                        uid: vm.$route.params.id,
                        lang: Cookies.get('dbLocalize')
                    }
                })
                    .then(function (response) {
                        reload && (vm.loadingapi = false);
                        vm.decks = response.data.result.deck_info;

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
            export_deck(index) {
                let uri = "llproxy/deckExport/?uid=" + this.$route.params.id + "&unitDeckId=" + index;
                if (Cookies.get('dbLocalize') === 'JP') {
                    uri += "&lang=JP";
                } else {
                    uri += "&lang=CN";
                }
                window.open(util.api_server + uri)
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

    .livetable {
        width: auto;
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    .wt10 {
        width: 70px;
    }

    .wt100 {
        /*text-align: left;*/
        width: 125px;
    }

    .livetable {
        width: auto;
        height: auto;
        text-align: center;
    }

    .main-flag {
        background-color: #f3e5f5;
    }
</style>
