<template lang="html">
  <div id="sidebar" :class="[ (has_toggled) ? 'floating' : '', 'hovered', (mobile && sidenavStatus) ? 'mobile' : '' ]" @focus="enter()" @mouseenter="enter()" @mouseleave="leave()">
      <div class="top">
          <!-- <img :src="$auth.user.company.logo" width="100px" /> -->
          <div class="toggle pointer" @click="toggleNav()" v-if="!mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#0084B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fill">
                  <circle cx="12" cy="12" r="10"></circle>
                  <transition name="fade">
                      <circle cx="12" cy="12" r="3" v-if="!has_toggled"></circle>
                  </transition>
              </svg>
          </div>
      </div>
      <!-- <div class="shadow"></div> -->
      <div class="bottom">
          <ul class="list">
                <template v-for="(data, key) in links">
                    <li class="item">
                        <nuxt-link :event="''" :to="data.slug" :class="[ 'link', (data.subs) ? 'parent' : '' ]" exact-active-class="exact" active-class="active" @click.native.prevent.self="navigate(data, $event)">
                            <div class="link_icon" v-html="data.icon"></div>
                            <span>{{ data.name }}</span>
                        </nuxt-link>
                        <div class="sub" v-if="data.subs">
                            <ul class="sub_list">
                                <li class="inner_sub_item" v-for="(sub, key) in data.subs" :key="key">
                                <nuxt-link :event="''" :class="[ 'link', (sub.inner_subs) ? 'sub_parent' : '' ]" :to="sub.slug" exact-active-class="exact"
                                        active-class="active" @click.native.prevent.self="navigateInner(sub, $event)">
                                        <div class="sub_link_icon" v-html="sub.icon"></div>
                                        <span>{{ sub.name }}</span>
                                    </nuxt-link>
                                    <div class="sub second_level" v-if="sub.inner_subs">
                                        <ul class="inner_sub_list">
                                            <li class="sub_item" exact-active-class="exact" active-class="active" v-for="(inner_sub, key) in sub.inner_subs">
                                                <a class="sub_link" :href="inner_sub.slug" :key="$route.fullPath" v-show="inner_sub.name == 'Hotels'">
                                                    <div class="sub_link_icon" v-html="inner_sub.icon"></div>
                                                    <span>{{inner_sub.name}}</span>
                                                </a>
                                                <nuxt-link class="sub_link" :to="inner_sub.slug" v-show="inner_sub.name !== 'Hotels'">
                                                    <div class="sub_link_icon" v-html="inner_sub.icon"></div>
                                                    <span> {{inner_sub.name}}</span>
                                                </nuxt-link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </template>
                <li class="item">
                <nuxt-link :event="''" to="javascript:void()" class="link" @click.native.prevent.self="logout()">
                    <div class="link_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 25px;"><path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z" fill="#4A5061"/></svg>
                    </div>
                    <span>Log out</span>
                </nuxt-link>
                </li>
          </ul>

      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data () {
        return {
            hovered: false,
            user_logout: false
        }
    },
    computed: {
        ...mapGetters ({
            links: 'global/sidebar/getLinks',
            foreman_links: 'global/sidebar/getForemanLinks',
            has_toggled: 'global/sidebar/hasToggled',
            sidenavStatus: 'global/settings/getSidenavStatus',
            mobile: 'global/settings/getMobile',
        }),
    },
    methods: {
        navigate (data, event) {

            const me = this,
                target = event.target
                
            if (data.subs) {
              
                //if not toggled, 
                if (!target.parentNode.classList.contains('toggled')) {
                    // lagyan ng height na same sa subcontainer
                    target.nextElementSibling.style.height = `${target.nextElementSibling.scrollHeight}px`
                    // add class toggled
                    target.parentNode.classList.add('toggled')
                } else {
                    target.nextElementSibling.style.height = 0
                    target.parentNode.classList.remove('toggled')
                }
            } else {
                me.$router.push(data.slug)
               this.hideMobileSidebar()
            }

        },
        hideMobileSidebar() {
            if (this.mobile) {
                this.$store.commit('global/settings/setSideBar', false)
            }
        },
        navigateInner (data, event) {
            const me = this,
                target = event.target,
                elements = document.querySelectorAll('.list .toggled .sub')
            if (data.inner_subs) {
                //if not toggled, 
                if (!target.parentNode.classList.contains('toggled')) {
                    // lagyan ng height na same sa subcontainer
                    target.nextElementSibling.style.height = `${target.nextElementSibling.scrollHeight}px`
                    // add class toggled
                    target.parentNode.classList.add('toggled')
                    elements.forEach((element, index) => {
                        setTimeout( () => {
                            const length = element.querySelectorAll('.sub_list').length
                            const height = element.querySelector('.sub_list').scrollHeight
                            const inner_length = element.querySelectorAll('.inner_sub_list').length
                            const inner_height = element.querySelector('.inner_sub_list').scrollHeight
                            const currentHeight = height * length + 50
                            element.style.height = `${currentHeight}px`
                        }, 200)
                    })

                    me.hovered = false
                    document.getElementById('sidebar').classList.remove('hovered')
                } else {
                    target.nextElementSibling.style.height = 0
                    target.parentNode.classList.remove('toggled')
                    elements.forEach((element, index) => {
                        setTimeout( () => {
                            const length = element.querySelectorAll('.sub_list').length
                            const height = element.querySelector('.sub_list').scrollHeight
                            const currentHeight = height * length
                            element.style.height = `${currentHeight}px`
                        }, 200)
                    })

                    me.hovered = false
                    document.getElementById('sidebar').classList.remove('hovered')
                }
            } else {
                me.$router.push(data.slug)
                this.hideMobileSidebar()
            }
        },
        enter () {
            const me = this,
                elements = document.querySelectorAll('.list .toggled .sub')
            if (!me.hovered) {
                elements.forEach((element, index) => {
                    setTimeout( () => {
                        const length = element.querySelectorAll('.sub_list').length
                        const height = element.querySelector('.sub_list').scrollHeight
                        const currentHeight = height * length
                        element.style.height = `${currentHeight}px`
                    }, 500)
                })
            }
            me.hovered = true

            document.getElementById('sidebar').classList.add('hovered')
        },
        leave () {
            const me = this,
                elements = document.querySelectorAll('.list .toggled .sub')
            elements.forEach((element, index) => {
                setTimeout( () => {
                    const length = element.querySelectorAll('.sub_list').length
                    const height = element.querySelector('.sub_list').scrollHeight
                    const currentHeight = height * length
                    element.style.height = `${currentHeight}px`
                }, 200)
            })

            me.hovered = false
            document.getElementById('sidebar').classList.remove('hovered')
        },
        toggleNav () {
            const me = this
            me.$store.commit('global/sidebar/checkToggler', { status: (me.has_toggled) ? false : true })
        },
        checkHeightViewport () {
            const me = this
            let heightToDeduct = document.querySelector('#sidebar .top')
            if (document.documentElement && document.documentElement.clientHeight) {
                document.querySelector('#sidebar .bottom').style.maxHeight = `${document.documentElement.clientHeight - heightToDeduct.scrollHeight}px`
            }
        },
        async logout () {
            const me = this
            await me.$auth.logout().then(res => {
                me.user_logout = true
                window.location.assign('/')
            })
        },
        setData() {
            alert('wow')
        }
    },
    mounted () {
        const me = this
        console.log(this.$auth.user)
        me.checkHeightViewport()
    },
    beforeMount () {
        window.addEventListener('load', this.checkHeightViewport)
        window.addEventListener('resize', this.checkHeightViewport)
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.checkHeightViewport)
        window.removeEventListener('load', this.checkHeightViewport)
    }
}
</script>
<style lang="styl">
    /* body,
    .trade_tech
        overflow: hidden !important */
    @media(max-width: 768px)
        #sidebar
            left: -85%
            &.mobile
                left: 0
</style>

