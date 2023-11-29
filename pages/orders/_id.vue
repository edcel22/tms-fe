<template>
  <div id="update_customer" class="page" v-if="loaded">
    <div class="box mb order_details">
      <div class="top_box inline">
        <h2>Details</h2>
      </div>
      <div class="bottom_box">
        <div class="group_inline two">
          <div class="group bordered filled">
          </div>
        </div>
      </div>
    </div>
    <div class="box mb">
      <div class="top_box inline">
        <h2>Update Customer</h2>
      </div>
      <div class="bottom_box">
        <form id="updateOrder" class="content_middle form" @submit.prevent="updateCustomerUser()">
          <div class="group_inline two">
            <div class="group bordered filled">
              <label for="name">Client *</label>
              <v-select v-model="form.customer_client_id" name="client" :options="clients" :reduce="client => client.id" label="name" />
              <transition name="slide"><span class="validate" v-if="errors.has('customer_client_id')">{{ properFormat(errors.first('customer_client_id')) }}</span></transition>
              <div class="dd"></div>
            </div>
            <div class="group bordered filled">
              <label for="name">Status *</label>
              <v-select v-model="form.status_id" name="status" :options="statuses" :reduce="status => status.id" label="name" />
              <transition name="slide"><span class="validate" v-if="errors.has('status_id')">{{ properFormat(errors.first('status_id')) }}</span></transition>
              <div class="dd"></div>
            </div>
          </div>
          <div class="group_inline three">
            <div class="group bordered filled">
              <label for="start_date">Start Date *</label>
              <v-ctk v-model="form.start_date" id="date-range" :format="'YYYY-MM-DD'" :only-date="true" :formatted="'YYYY-MM-DD'" name="start_date" data-vv-name="start_date" :overlay="true" :range="false" v-validate="{ required: true }"></v-ctk>
              <transition name="slide"><span class="validate" v-if="errors.has('start_date')">{{ properFormat(errors.first('start_date')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="end_date">End Date *</label>
              <v-ctk v-model="form.end_date" id="date-range" :format="'YYYY-MM-DD'" :only-date="true" :formatted="'YYYY-MM-DD'" name="end_date" data-vv-name="end_date" :overlay="true" :range="false" v-validate="{ required: true }"></v-ctk>
              <transition name="slide"><span class="validate" v-if="errors.has('end_date')">{{ properFormat(errors.first('end_date')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="delivered_date">Delivered Date *</label>
              <v-ctk v-model="form.delivered_date" id="date-range" :format="'YYYY-MM-DD'" :only-date="true" :formatted="'YYYY-MM-DD'" name="delivered_date" data-vv-name="delivered_date" :overlay="true" :range="false"></v-ctk>
              <transition name="slide"><span class="validate" v-if="errors.has('delivered_date')">{{ properFormat(errors.first('delivered_date')) }}</span></transition>
            </div>
          </div>
          <div class="group">
            <div class="group bordered filled">
              <label for="po_customer_notes">Notes</label>
              <textarea 
                class="input wysiwyg" 
                name="po_customer_notes" 
                id="po_customer_notes" 
                autocomplete="off" 
                v-model="form.po_customer_notes">
              </textarea>
            </div>
          </div>
          <button type="submit" class="primary_button pointer ml ten">Save</button>
          <nuxt-link to="/orders" class="cancel_button pointer ml ten" >Cancel</nuxt-link>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loaded: false,
        form: {
          status_id: '',
          start_date: '',
          end_date: '',
          delivered_date: '',
          po_customer_notes: '',
          customer_client_id: ''
        },
        statuses: [
          {
            name: 'Pending',
            id: 1
          },
          {
            name: 'Sent to Vendor',
            id: 2
          },
          {
            name: 'Active',
            id: 3
          },
          {
            name: 'Delivered',
            id: 4
          },
        ],
        series: [
          {
            name: 'Selected Week',
            data: []
          }
        ],
      }
    },
    methods: {
      updateCustomerUser() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            let formData = new FormData(document.getElementById('updateOrder'))
            formData.append('status_id', this.form.status_id)
            formData.append('customer_client_id', this.form.customer_client_id)
            formData.append('_method', 'PATCH')

            this.$axios.post(`orders/${this.$route.params.id}`, formData).then(res => {
              this.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Order Updated!' })
              setTimeout(() => {
                // this.$router.push('/orders')
              }, 300);
            }).catch(err => {
              this.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
            }).then(() => {
              setTimeout( () => {
                this.$store.commit('global/loader/checkLoader', { status: false })
                document.body.classList.remove('no_scroll', 'no_click')
              }, 500)
              this.loaded = true
            })
          } else {
            this.$scrollTo('.validate', {
              offset: -250
            })
          }
        })
      },
      fetchData() {
        this.$axios.get(`/orders/${this.$route.params.id}`).then(res => {
          this.order = res.data.order
          this.services = res.data.services
          this.pricing_plans = res.data.pricing_plans
          this.clients = res.data.clients
          this.form.customer_client_id = res.data.order.customer_client_id
          this.form.status_id = res.data.order.status_id
          this.form.start_date = res.data.order.start_date
          this.form.end_date = res.data.order.end_date
          this.form.delivered_date = res.data.order.delivered_date
          this.form.po_customer_notes = res.data.order.po_customer_notes
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
    mounted() {
      this.fetchData()
    }
  }
</script>

<!-- 

  fields
   service => select
   plan => select
   client => select
   status => select
   po_customer_notes => textarea   
   start_date => calendar
   end_date => calendar
   delivered_date => calendar
 -->