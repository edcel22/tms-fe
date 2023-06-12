export default {
    populateTitle (state, payload) {
        state.title = payload.title
    },
    setSideBar (state, payload) {
		state.isShowSideNav = payload
	},
    enteredMobile (state, payload) {
        state.mobile = payload.status
    },
}
