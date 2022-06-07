
const state = {
  completeShow: false,
  cancelShow: false,
  listingShow: false,
  reservedShow: false,
  refresh: false,

};

const mutations = {

  SET_COMPLETESHOW(state, e) {
    state.completeShow = e;
  },
  SET_CANCELSHOW(state, e) {
    state.cancelShow = e;
  },
  SET_LISTINGSHOW(state, e) {
    state.listingShow = e;
  },
  SET_RESERVEDSHOW(state, e) {
    state.reservedShow = e;
  },
  SET_REFRESH(state, e) {
    state.refresh = e;
  },
};
const actions = {

};

export default {
  state,
  mutations,
  actions
};
