export default function ({ store, redirect, error }) {
  if(store.state.auth.user) {
    redirect('/customers')
  }
}
