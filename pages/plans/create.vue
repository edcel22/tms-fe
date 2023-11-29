<template>
  <div id="create_service" class="page" v-if="loaded">
    <div class="box mb">
      <div class="top_box inline">
        <h2>Create Plan</h2>
      </div>
      <div class="bottom_box">
        <form id="CreatePlanForm" class="content_middle form" @submit.prevent="createPlan()">
          <div class="group_inline two">
            <div class="group bordered filled">
              <label for="name">Plan name *</label>
              <input type="text" class="input" name="name" autocomplete="off" v-model="form.name"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('name')">{{ properFormat(errors.first('name')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="name">Service *</label>
              <v-select v-model="form.service_id" name="service" :options="services" :reduce="service => service.id" label="name" />
              <transition name="slide"><span class="validate" v-if="errors.has('service_id')">{{ properFormat(errors.first('service_id')) }}</span></transition>
              <div class="dd"></div>
            </div>
          </div>
          <div class="group bordered filled">
            <label for="description">Description *</label>
            <textarea class="input" name="description" autocomplete="off" v-model="form.description" v-validate="'required'" rows="3"></textarea>
            <transition name="slide">
              <span class="validate" v-if="errors.has('description')">{{ properFormat(errors.first('description')) }}</span>
            </transition>
          </div>
          <div class="group_inline four">
            <div class="group bordered filled">
              <label for="cost_to_platform">Vendor Price *</label>
              <input type="number" class="input" name="cost_to_platform" autocomplete="off" v-model="form.cost_to_platform"  v-validate="{ required: true }" min="0" step="0.01" />
              <transition name="slide"><span class="validate" v-if="errors.has('cost_to_platform')">{{ properFormat(errors.first('cost_to_platform')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="social_owl_margin">Social Owl Margin *</label>
              <input type="number" class="input" name="social_owl_margin" autocomplete="off" v-model="form.social_owl_margin"  v-validate="{ required: true }" min="0" step="0.01" />
              <transition name="slide"><span class="validate" v-if="errors.has('social_owl_margin')">{{ properFormat(errors.first('social_owl_margin')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="wholesale_price">Total (Wholesale) Price *</label>
              <input type="number" class="input" name="wholesale_price" autocomplete="off" v-model="form.wholesale_price"  v-validate="{ required: true }" min="0" step="0.01" />
              <transition name="slide"><span class="validate" v-if="errors.has('wholesale_price')">{{ properFormat(errors.first('wholesale_price')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="name">Status *</label>
              <v-select v-model="form.status_id" name="status" :options="statuses" :reduce="status => status.id" label="name" />
              <transition name="slide"><span class="validate" v-if="errors.has('status_id')">{{ properFormat(errors.first('status_id')) }}</span></transition>
              <div class="dd"></div>
            </div>
          </div>
          <button type="submit" class="primary_button pointer ml ten">Save</button>
          <nuxt-link to="/plans" class="cancel_button pointer ml ten" >Cancel</nuxt-link>
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
          name: '',
          service_id: '',
          description: '',
          cost_to_platform: 0,
          social_owl_margin: 0,
          wholesale_price: 0, 
          status_id: 1,
        },
        services: [],
        statuses: [
          {
            name: 'Active',
            id: 1
          },
          {
            name: 'InActive',
            id: 0
          }
        ]
      }
    },
    methods: {
      createPlan() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            let formData = new FormData(document.getElementById('CreatePlanForm'))
            formData.append('status_id', this.form.status_id)
            formData.append('service_id', this.form.service_id)

            this.$axios.post(`/plans`, formData).then(res => {
              this.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Plan Created!' })
              setTimeout(() => {
                this.$router.push('/plans')
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
        this.$axios.get('/services').then(res => {
            this.services = res.data.data
        }).catch(err => {
            this.$store.commit('global/catcher/populateErrors', { items: err.response.data.errors })
        }).then(() => {
            setTimeout( () => {
                this.$store.commit('global/loader/checkLoader', { status: false })
                document.body.classList.remove('no_scroll', 'no_click')
            }, 500)
            this.loaded = true
        })
      },
    },
    mounted() {
      this.fetchData()
    }
  }
</script>