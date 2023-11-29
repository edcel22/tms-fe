<template>
  <div class="page" v-if="loaded">
    <div class="box">
      <table class="table">
        <thead>
          <tr>
            <th class="stick">
              <div :class="`label`">
                Order Number
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Plan Name
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Service Name
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Client Name
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Order By
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Status
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="orders && orders.length > 0">
          <tr v-for="(order, key) in orders" :key="key">
            <td>
              <nuxt-link :to="`/orders/${order.id}`" class="clickable">{{ order.order_number }}</nuxt-link>
            </td>
            <td>{{ order.pricing_plan.name }}</td>
            <td>{{ order.pricing_plan.service.name }}</td>
            <td>{{ (order.customer_client) ? order.customer_client.name : '' }}</td>
            <td>{{ (order.user) ? order.user.email : '' }}</td>
            <td>{{ orderStatus(order.status_id) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  export default {
    data () {
      return {
        orders: [],
        loaded: false
      }
    },
    methods: {
      fetchData() {
        this.$axios.get('/orders/all-orders').then(res => {
            this.orders = res.data.orders
        }).catch(err => {
            this.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
        }).then(() => {
            setTimeout( () => {
                this.$store.commit('global/loader/checkLoader', { status: false })
                document.body.classList.remove('no_scroll', 'no_click')
            }, 500)
            this.loaded = true
        })
      }
    },
    mounted () {
      this.fetchData()
    }
  }
</script>
