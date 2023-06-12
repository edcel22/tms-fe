<template>
  <div id="create_task" class="page" v-if="loaded">
    <div class="box mb">
      <div class="top_box inline">
        <h2>Create Task</h2>
      </div>
      <div class="bottom_box">
        <form class="content_middle form" @submit.prevent="createTask()">
          <div class="group_inline two">
            <div class="group bordered filled">
              <label for="title">Title</label>
              <input type="text" class="input" name="title" autocomplete="off" v-model="form.title"  v-validate="{ required: true }" />
              <transition name="slide"><span class="validate" v-if="errors.has('title')">{{ properFormat(errors.first('title')) }}</span></transition>
            </div>
            <div class="group select bordered filled">
              <label for="state">Select Status</label>
              <select
                  class="input select" 
                  v-model="form.completion_status"
                  name="completion_status"
                  v-validate="{ required: true }">
                  <option 
                      v-for="status in statuses" 
                      :value="status.value"
                      selected="status.value === form.completion_status">
                          {{ status.name }}
                  </option>
              </select>
              <transition name="slide"><span class="validate" v-if="errors.has('state')">{{ properFormat(errors.first('state')) }}</span></transition>
            </div>
          </div>
          <div class="group bordered filled">
            <label for="description">Description</label>
            <textarea 
              class="input wysiwyg" 
              name="description" 
              id="description" 
              autocomplete="off" 
              v-model="form.description"
              v-validate="{ required: true }">
            </textarea>
            <transition name="slide"><span class="validate" v-if="errors.has('description')">{{ properFormat(errors.first('description')) }}</span></transition>
          </div>
          <div class="group bordered filled">
            <label for="date">Date</label>
            <v-ctk 
              v-model="form.due_date" 
              id="date-range" 
              :format="'DD/MM/YYYY'" 
              :only-date="true" 
              :no-label="true" 
              :no-button="true" 
              :formatted="'DD/MM/YYYY'" 
              name="due_date" 
              data-vv-name="due_date" 
              :range="false" 
              :disabled-dates="disabledDates">
            </v-ctk>
            <transition name="slide"><span class="validate" v-if="errors.has('due_date')">{{ properFormat(errors.first('due_date')) }}</span></transition>
          </div>
          <button type="submit" class="primary_button pointer ml ten">Save</button>
          <nuxt-link to="/tasks" class="cancel_button pointer ml ten" >Cancel</nuxt-link>
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
        disabledDates: this.getDisabledDates(),
        form: {
          title: '',
          description: '',
          completion_status: 0,
          due_date: ''
        },
        statuses: [
          {
            name: 'Completed',
            value: 1
          },
          {
            name: 'Incomplete',
            value: 0
          }
        ]
      }
    },
    methods: {
      createTask() {
        this.$validator.validateAll().then(valid => {
          if (valid) {
            this.$axios.post(`/tasks/task`, this.form).then(res => {
              this.$store.dispatch('global/toast/addToast', { type: 'success', message: 'Task Created!' })
              setTimeout(() => {
                this.$router.push('/tasks')
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
      this.form.due_date = this.$moment().format('DD/MM/YY')
      this.loaded = true
      }
    },
    mounted() {
      this.initialization()
    }
  }
</script>