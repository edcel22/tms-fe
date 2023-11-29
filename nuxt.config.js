export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'shop-services-panel',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.6.0.min.js' },
      { src: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/html5sortable/0.9.18/html5sortable.min.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#0084B0',
    throttle: 0,
    height: '4px'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/stylus/app.styl'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-line-clamp', ssr: false },
    { src: '~/plugins/vue-ctk-date-time-picker', ssr: false },
    { src: '~/plugins/vue-datepicker', ssr: false },
    { src: '~/plugins/vue-range-datepicker', ssr: false },
    { src: '~/plugins/vue-scrollto', ssr: false },
    { src: '~/plugins/v-select.js', ssr: false },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-moment' },
    { src: '~/plugins/vue-click-outside' },
    { src: '~/plugins/mixins'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          maxAge: 604800
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          user: { url: '/authenticated-user', method: 'get', propertyName: 'user'},
          logout: { url: '/logout', method: 'post' }
        }
      }
    },
    redirect: {
      login: '/',
      home: '/customers'
    }
  },
  router: {
    middleware: ['auth']
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: '/',
    baseURL: process.env.API_URL,
    credentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  },

  env: {
    baseUrl: process.env.BASE_URL
  },
  
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  server: {
    port: process.env.PORT
  }
}
