// import { initContracts } from "@/utils/common.ts";
import Cookie from 'js-cookie'
import Vue from 'vue'
import web3 from './web3'
Vue.mixin({
    data () {
        return {
            Cookie: Cookie,
            web3: web3
        }
    },
    methods: {
        routerReload () {
            this.$store.commit('SET_RELOAD', false)
            this.$nextTick(()=> {
                this.$store.commit('SET_RELOAD', true)
            })
        }
    },
})
