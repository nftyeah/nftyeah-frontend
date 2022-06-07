
const state = {
  remindDialogShow: false,
  remindDelDialogShow: false
};

const mutations = {

  SET_REMINDDIALOGSHOW(state, e) {
    state.remindDialogShow = e;
  },
  SET_REMINDDELDIALOGSHOW(state, e) {
    state.remindDelDialogShow = e;
  }
};
const actions = {

};

export default {
  state,
  mutations,
  actions
};
