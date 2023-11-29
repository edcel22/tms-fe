<template>
  <div id="update_service" class="page" v-if="loaded">
    <div class="box mb">
      <div class="top_box inline">
        <h2>Update Service</h2>
      </div>
      <div class="bottom_box">
        <form id="updateServiceForm" class="content_middle form" @submit.prevent="updateService()">
          <div class="group bordered filled">
            <label for="name">Name *</label>
            <input type="text" class="input" name="name" autocomplete="off" v-model="form.name"  v-validate="{ required: true }" />
            <transition name="slide"><span class="validate" v-if="errors.has('name')">{{ properFormat(errors.first('name')) }}</span></transition>
          </div>
          <div class="group bordered filled">
            <label for="description">Description *</label>
            <textarea class="input" name="description" autocomplete="off" v-model="form.description" v-validate="'required'" rows="3"></textarea>
            <transition name="slide">
              <span class="validate" v-if="errors.has('description')">{{ properFormat(errors.first('description')) }}</span>
            </transition>
          </div>
          <button type="submit" class="primary_button pointer ml ten">Update</button>
          <nuxt-link to="/services" class="cancel_button pointer ml ten" >Cancel</nuxt-link>
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
          description: '',
          status_id: 1
        },
        statuses: [
          {
            name: 'Active',
            id: 1
          },
          {
            name: 'InActive',
            id: 2
          }
        ]
      }
    },
    methods: {
      updateService() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            let formData = new FormData(document.getElementById('updateServiceForm'))
            formData.append('status_id', this.form.status_id)
            formData.append('_method', 'PATCH')

            this.$axios.post(`services/${this.$route.params.id}`, formData).then(res => {
              this.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Service Created!' })
              setTimeout(() => {
                this.$router.push('/services')
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
        this.$axios.get(`/services/${this.$route.params.id}`).then(res => {
          this.form.name = res.data.data.name
          this.form.description = res.data.data.description
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