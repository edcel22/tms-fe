<template>
  <div id="login">
      <Login />
  </div>
</template>
<script>
  export default {
    auth: false,
    middleware: ['login'],
  }
</script>
<!-- Component's internal Css -->
<style lang="stylus">
  #login
    width: 100%
</style>