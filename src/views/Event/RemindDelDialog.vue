<template>
  <el-dialog
    :visible="remindDelDialogShow"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="closeDepositModel"
    center
    width="560px"
    class="remindDelDialog"
  >
    <div slot="title" class="title">Delete this reminder</div>
    <div class="content">
      Are you sure you want to delete this reminder ?
    </div>
    <div class="action">
      <div class="btn center cancel" @click="$store.commit('SET_REMINDDELDIALOGSHOW', false)">Cancel</div>
      <div class="btn center" @click="confirm()">Confirm</div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { postDelNotify } from "@/plugins/request";
export default {
  name: "remindDialog",
  props: ["selectData"],
  computed: {
    ...mapState(["remindDelDialogShow","loginSign","address"]),
  },

  data: () => ({
    
  }),
  methods: {
    ...mapActions(["loginSignCall"]),
    async confirm () {
      if(!this.loginSign){
        const r = await this.loginSignCall();
        if (!r) {
          return;
        }
      }
      console.log(this.selectData)
      postDelNotify(this.selectData.id,this.address,this.loginSign).then(e => {
        this.$store.commit('SET_REMINDDELDIALOGSHOW', false)
        this.$emit("remindRefresh")
      });
    },
    closeDepositModel() {
      this.$store.commit("SET_REMINDDELDIALOGSHOW", false);
    },
  },
};
</script>

<style lang="sass" scoped>
$Tahoma-Bold: Tahoma-Bold
$Tahoma: Tahoma

.remindDelDialog
  .title
    color: #222222
    font-weight: bold
    font-family: $Tahoma-Bold
    font-size: 20px
  .line
    border-bottom: 1px solid #EEEEEE
  .content
    margin-bottom: 30px
  .action

    display: flex
    justify-content: center
    .cancel
      color: #725DFF !important
      border: 1px #725DFF solid
      background: transparent
    .btn
      color: #FFF 
      margin: 0 10px
</style>