<template>
  <div class="page" v-if="loaded">
    <div class="actions">
			<nuxt-link :to="`/vendors/create`" class="primary_button pointer">
				<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
				<span>Create Vendor</span>
			</nuxt-link>
		</div>
    <div class="box">
      <table class="table">
        <thead>
          <tr>
            <th class="stick">
              <div :class="`label`">
                Name
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Email
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Contact Number
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Complete Address
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Status
              </div>
            </th>
            <th class="stick">
              <div :class="`label`">
                Action
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="vendors && vendors.length > 0">
          <tr v-for="(vendor, key) in vendors" :key="key">
            <td>
              <nuxt-link :to="`/vendors/${vendor.id}`" class="clickable">{{ vendor.name }}</nuxt-link>
            </td>
            <td>{{ vendor.email }}</td>
            <td>{{ vendor.user_detail.contact_number }}</td>
            <td>{{ vendor.user_detail.adress }} {{ vendor.user_detail.city }} {{ vendor.user_detail.zip }}</td>
            <td>{{ activeStatus(vendor.is_active) }}</td>
            <td class="buttons">
              <div class="wrapper">
                  <div class="item ml delete pointer tooltip" @click="toggleConfirmation(vendor)">
                      <span>
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-can" class="svg-inline--fa fa-trash-can " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"></path></svg>
                      </span>
                      <span class="tooltiptext">Delete</span>
                  </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation -->
    <delete-confirmation
      ref="confirmation"
      :item="'User'"
      :api="api"
    />
  </div>
</template>
<script>
  import DeleteConfirmation from '~/components/global/DeleteConfirmation'
  import moment from 'moment'

  export default {
    components: {
      DeleteConfirmation
    },
    data () {
      return {
        vendors: [],
        loaded: false,
        api: ''
      }
    },
    methods: {
      toggleConfirmation (data) {
          setTimeout( () => {
              this.api = `/users/${data.id}/delete`
              this.$refs.confirmation.opened = true
          }, 10)
      },
      fetchData() {
        this.$axios.get('/vendors').then(res => {
            this.vendors = res.data.data
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
