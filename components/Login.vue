<template>
  <div id="login" v-if="loaded">
    <div class="wrapper">
       <!-- Company Image -->
        <div class="left">
            <img src="/sample_logo.png" />
        </div>
        <!-- Login Form -->
        <div class="right">
          <div class="overlay">
              <br>
              <h2>Login</h2>
              <h3>Welcome back, Please login to continue</h3> 
              <form class="form" id="action" @submit.prevent="submit()">
                  <div class="group floating">
                      <input type="text" :class="[ 'input', (form.email.length > 0) ? 'filled' : '' ]" name="email" autofocus autocomplete="off" v-model="form.email" v-validate="{ required: true, email: true }">
                      <label for="email">Email Address</label>
                      <transition name="slide"><span class="validate" v-if="errors.has('email')">{{ properFormat(errors.first('email')) }}</span></transition>
                  </div>
                  <div class="group floating">
                      <input type="password" :class="[ 'input', (form.password.length > 0) ? 'filled' : '' ]" name="password" autocomplete="off" v-model="form.password" v-validate="{ required: true }">
                      <label for="password">Password</label>
                      <transition name="slide"><span class="validate" v-if="errors.has('password')">{{ properFormat(errors.first('password')) }}</span></transition>
                  </div>
                  <div class="buttons">
                      <button type="submit" class="primary_button pointer">Login</button>
                  </div>
              </form>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    data () {
      return {
        loaded: false,
        form: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      /**
       * login submission
       * calling of nuxt auth plugin
       */
      submit () {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            this.$store.commit('global/loader/checkLoader', { status: true })
            this.$auth.loginWith('local', { data: this.form }).then(res => {
              this.$router.push('/customers')
            }).catch(err => {
              this.$store.commit('global/catcher/populateErrors', { items: [err.response.data.errors] })
            }).then(() => {
              this.$store.commit('global/loader/checkLoader', { status: false })
              document.body.classList.remove('no_scroll', 'no_click')
            })
          } else {
            this.$scrollTo('.validate', {
            offset: -250
          })
          }
        })
      },
      initialization (event) {
        this.$store.commit('global/loader/checkLoader', { status: false })
        if (document.readyState != 'interactive') {
          setTimeout( () => {
            this.$store.commit('global/loader/checkLoader', { status: false })
            this.loaded = true
            document.body.classList.remove('no_scroll', 'no_click')
          }, 1000)
        }
      }
    },
    mounted () {
        this.initialization()
    },
    asyncData ({ store }) {
        store.commit('global/loader/checkLoader', { status: true })
    },
    beforeMount () {
        window.addEventListener('load', this.initialization)
    },
    beforeDestroy () {
        window.removeEventListener('load', this.initialization)
    },
    head () {
        return {
            title: 'Welcome | Services Shop'
        }
    }
}
</script>

<style lang="styl">
    @media(max-width: 1308px)
        #login
            .wrapper
                max-width: 90%
                .left
                    flex: 0 0 50%
    @media(max-width: 1024px)
        #login
            .wrapper
                .left
                    display: block
    @media(max-width: 768px)
        #login
            .wrapper 
                display: flex
                flex-flow: column wrap
                width: 100%
                max-width: calc(100% - 20px)
                margin: 0 10px
                .right
                    border-radius: 10px
                    .overlay
                        position: relative
                        transform: none
                .left
                    display: none
</style>