<template>
  <div :class="[ 'task_management_system', (has_toggled) ? 'full' : '', (sidenavStatus) ? 'no_scroll no_click' : '' ]">

       <transition name="fade">
          <topbar v-if="$auth.loggedIn" />
      </transition>
      <Nuxt />
      
      <transition name="fade">
          <sidebar v-if="$auth.loggedIn" />
      </transition>
      
      <catcher />
      
      <transition name="fade">
          <loader v-if="has_loaded && $auth.loggedIn" />
      </transition>

      <ul id="toast_wrapper" :class="[ (toasts > 0) ? '' : 'none' ]"></ul>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Sidebar from '~/components/global/Sidebar'
  import Loader from '~/components/global/Loader'
  import Catcher from '~/components/global/Catcher'
  import Topbar from '~/components/global/TopBar'

  export default {
    middleware: ['sidebar'],
    components: {
        Sidebar,
        Catcher,
        Loader,
        Topbar
    },
    data () {
        return {
            padding: 0,
            authenticated: false,
            routes: [
                '/',
                '/register'
            ]
        }
    },
    computed: {
        ...mapGetters ({
            has_loaded: 'global/loader/hasLoaded',
            has_toggled: 'global/sidebar/hasToggled',
            toasts: 'global/toast/getToasts',
            is_show: 'global/sidebar/is_show',
            sidenavStatus: 'global/settings/getSidenavStatus'
        })
    },
    methods: {
        windowScroll () {
            const me = this
            let selector = document.querySelector('.table')
            if (selector) {
                let bounding = selector.getBoundingClientRect()
                if (bounding.top < 50) {
                    selector.querySelector('thead').classList.add('sticky')
                } else {
                    selector.querySelector('thead').classList.remove('sticky')
                }
            }
        },
        /**
        * check website viewport if mobile or web */
        onResize () {
            const me = this
            if (document.documentElement && document.documentElement.clientWidth) {
                if (document.documentElement.clientWidth <= 768) {
                    me.$store.commit('global/settings/enteredMobile', { status: true })
                } else {
                    me.$store.commit('global/settings/enteredMobile', { status: false })
                }
            }
        },
        async validateToken () {
            const me = this
            me.authenticated = (me.$auth.user) ? true : false
            if (!me.authenticated) {
                await me.$auth.logout().then(res => {
                    window.location.assign('/')
                })
            }
        }
    },
    mounted () {
      const me = this
      if (this.$route.path !== '/register') {
          if (!me.routes.includes(me.$route.path)) {
              me.validateToken()
          } else {
            me.authenticated = false
          }
      }
    },
    beforeMount () {
        window.addEventListener('scroll', this.windowScroll)
        window.addEventListener('load', this.onResize)
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.windowScroll)
        window.removeEventListener('load', this.onResize)
        window.removeEventListener('resize', this.onResize)
    },
    head () {
        return {
            title: 'Task Management System',
            script: [
            // { src: 'https://code.jquery.com/jquery-3.2.1.slim.min.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.js' },
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.js' },
            { src: 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js' }
            ],
            link: [
                { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.css' },
                { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/theme/monokai.css' },
                { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css' }
            ],
        }
    }
  }
</script>
