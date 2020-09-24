import Vue from 'vue'
import App from './App.vue'
import MuseUI from 'muse-ui'
import VueRouter from 'vue-router'


import 'muse-ui/dist/muse-ui.css'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(MuseUI);


import user from './component/user.vue'
import intro from './component/introduction.vue'
// const userinfo = resolve => require(['./component/userInfo.vue'], resolve)
// const Units = resolve => require(['./component/units.vue'], resolve)
// const Live = resolve => require(['./component/live.vue'], resolve)
// const SecretBox = resolve => require(['./component/secretbox.vue'], resolve)
// const Search = resolve => require(['./component/search.vue'], resolve)
import userinfo from './component/userInfo.vue'
import Units from './component/units.vue'
import Live from './component/live.vue'
import LiveDetail from './component/livedetail.vue'
import LiveDuel from './component/liveduel.vue'
import SecretBox from './component/secretbox.vue'
import Search from './component/search.vue'
import Marathon from './component/marathon.vue'
import PNF from './component/pagenotfound.vue'
import Deck from './component/deck.vue'
import EffortBox from './component/effortbox.vue'
import DuelLiveBox from './component/duellivebox.vue'
import EffortBoxStat from './component/effortboxstat.vue'
import DuelLiveBoxStat from './component/duelliveboxstat.vue'
import Challenge from './component/challenge.vue'
import Festival from './component/festival.vue'
import Battle from './component/battle.vue'
import LpRecovery from './component/lprecovery.vue'
import Quest from './component/quest.vue'
// const TSwitch = resolve => require(['./component/themeswitch.vue'], resolve)
const router = new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/', redirect: '/user'
        },
        {
            name: 'user',
            path: '/user',
            component: user,
            children: [
                {
                    path: '',
                    component: intro
                },
                {
                    name: 'search',
                    path: 'search',
                    component: Search
                },
                // {
                //     name: 'switch',
                //     path: 'switch',
                //     component: TSwitch
                // },
                {
                    name: 'userInfo',
                    path: ':id',
                    component: userinfo
                },
                {
                    path: ':id/units',
                    component: Units
                },
                {
                    path: ':id/deck',
                    component: Deck,
                },
                {
                    path: ':id/live',
                    component: Live
                },
                {
                    path: ':id/liveduel',
                    component: LiveDuel
                },
                {
                    path: ':id/livedetail/:liveid',
                    component: LiveDetail
                },
                {
                    path: ':id/secretbox',
                    component: SecretBox
                },
                {
                    path: ':id/effortbox',
                    component: EffortBox
                },
                {
                    path: ':id/duellivebox',
                    component: DuelLiveBox
                },
                {
                    path: ':id/effortboxstat',
                    component: EffortBoxStat
                },
                {
                    path: ':id/duelliveboxstat',
                    component: DuelLiveBoxStat
                },
                {
                    path: ':id/marathon',
                    component: Marathon
                },
                {
                    path: ':id/battle',
                    component: Battle
                },
                {
                    path: ':id/festival',
                    component: Festival
                },
                {
                    path: ':id/challenge',
                    component: Challenge
                },
                {
                    path: ':id/lprecovery',
                    component: LpRecovery
                },
                {
                    path: ':id/quest',
                    component: Quest
                }

            ]
        },
        {
            path: '*', //redirect: '/user'
            component: PNF
        },

    ]
});
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
