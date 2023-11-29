<template>
  <div id="update_vendor" class="page" v-if="loaded">
    <div class="box mb">
      <div class="top_box inline">
        <h2>Update Vendor</h2>
      </div>
      <div class="bottom_box">
        <form id="updateVendorForm" class="content_middle form" @submit.prevent="updateVendorUser()">
          <div class="group_inline three">
            <div class="group bordered filled">
              <label for="first_name">Fist Name *</label>
              <input type="text" class="input" name="first_name" autocomplete="off" v-model="form.first_name"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('first_name')">{{ properFormat(errors.first('first_name')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="last_name">Last Name *</label>
              <input type="text" class="input" name="last_name" autocomplete="off" v-model="form.last_name"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('last_name')">{{ properFormat(errors.first('last_name')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="email">Email *</label>
              <input type="text" class="input" name="email" autocomplete="off" v-model="form.email"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('email')">{{ properFormat(errors.first('email')) }}</span></transition>
            </div>
          </div>
          <div class="group_inline three">
            <div class="group bordered filled">
              <label for="address">Address *</label>
              <input type="text" class="input" name="address" autocomplete="off" v-model="form.address"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('address')">{{ properFormat(errors.first('address')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="city">City *</label>
              <input type="text" class="input" name="city" autocomplete="off" v-model="form.city"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('city')">{{ properFormat(errors.first('city')) }}</span></transition>
            </div>
            <div class="group bordered filled">
              <label for="zip">Zip code *</label>
              <input type="text" class="input" name="zip" autocomplete="off" v-model="form.zip"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('zip')">{{ properFormat(errors.first('zip')) }}</span></transition>
            </div>
          </div>
          <div class="group_inline three">
            <div class="group bordered filled">
              <label for="contact_number">Contact Number *</label>
              <input type="text" class="input" name="contact_number" autocomplete="off" v-model="form.contact_number"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('contact_number')">{{ properFormat(errors.first('contact_number')) }}</span></transition>
            </div>
          </div>
          <button type="submit" class="primary_button pointer ml ten">Save</button>
          <nuxt-link to="/vendors" class="cancel_button pointer ml ten" >Cancel</nuxt-link>
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
          email: '',
          role_id: 2, 
          first_name: '',
          last_name: '',
          name: '',
          contact_number: '',
          address: '',
          city: '',
          zip: ''
        },
        statuses: [
          {
            name: 'Active',
            value: 1
          },
          {
            name: 'InActive',
            value: 0
          }
        ]
      }
    },
    methods: {
      updateVendorUser() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            let formData = new FormData(document.getElementById('updateVendorForm'))
            formData.append('name', this.form.first_name +" "+ this.form.last_name)
            formData.append('role_id', this.form.role_id)
            formData.append("id", this.$route.params.id)
            formData.append('_method', 'PATCH')

            this.$axios.post(`users/${this.$route.params.id}`, formData).then(res => {
              this.$store.dispatch('global/toast/addToast', { type: 'success', message: 'vendor Created!' })
              setTimeout(() => {
                this.$router.push('/vendors')
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
        this.$axios.get(`/vendors/${this.$route.params.id}`).then(res => {
          this.form.name = res.data.data.name
          this.form.first_name = res.data.data.user_detail.first_name
          this.form.last_name = res.data.data.user_detail.last_name
          this.form.address = res.data.data.user_detail.address
          this.form.city = res.data.data.user_detail.city
          this.form.zip = res.data.data.user_detail.zip
          this.form.contact_number = res.data.data.user_detail.contact_number
          this.form.email = res.data.data.email
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