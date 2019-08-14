<template>
    <div>
        <h1>test</h1>
        <p>under construction</p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'user-page',
    computed: mapGetters(['profile', 'user', 'isAuthenticated' ])
}
</script>