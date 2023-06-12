<template lang="html">
  <div id="header">
      <div class="header_nav">
        <div class="title">
            {{ title }}
        </div>
        <breadcrumb :separator="'◦'" />
      </div>
      <div class="header_select">
          <div class="header_user">
              <div class="user_name">Hello, {{ user.name }}!</div>
          </div>
      </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '~/components/global/Breadcrumb'

  export default {
      components: {
          Breadcrumb
      },
      data () {
          return {
              is_toggled: false,
              user_logout: false,
              user: {
                  email: ''
              },
              isActive: false,
          }
      },
      watch: {
          $route (to, from) {
              const me = this
              if (!me.user_logout) {
                  me.user = me.$auth.user
              }
          }
      },
      computed: {
        ...mapGetters({
            title: 'global/settings/getTitle',
            sidenavStatus: 'global/settings/getSidenavStatus'

        }),
      },
      methods: {
        showSidebar() {
            let isShow = this.sidenavStatus
            this.$store.commit('global/settings/setSideBar', isShow ^= true)
        },
        showSelect () {
            const me = this
            me.is_toggled ^= true
        },
        close (data = null) {
            const me = this
            me.is_toggled = false
        },
        async logout () {
            const me = this
            await me.$auth.logout().then(res => {
                me.user_logout = true
                window.location.assign('/')
            })
        }
      },
      mounted () {
          const me = this
          me.user = me.$auth.user
      }
  }
</script>