<template>
  <div id="create_service" class="page" v-if="loaded">
    <div class="box mb">
      <div class="top_box inline">
        <h2>Create Service</h2>
      </div>
      <div class="bottom_box">
        <form id="CreateServiceForm" class="content_middle form" @submit.prevent="createService()">
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
          <button type="submit" class="primary_button pointer ml ten">Save</button>
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
            id: 0
          }
        ]
      }
    },
    methods: {
      createService() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            let formData = new FormData(document.getElementById('CreateServiceForm'))
            formData.append('status_id', this.form.status_id)

            this.$axios.post(`/services`, formData).then(res => {
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
      initialization() {
      this.loaded = true
      }
    },
    mounted() {
      this.initialization()
    }
  }
</script>