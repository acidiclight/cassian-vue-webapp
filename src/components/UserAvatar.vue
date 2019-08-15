<template>
    <div>
        <b-img v-if="user.avatarURL && user.avatarURL.length" :src="user.avatarURL" circle></b-img>
        <i class="fa fas fa-user-circle" v-else></i>
        {{ displayName }}
    </div>
</template>

<script>
export default {
    name: 'user-avatar',
    props: [ 'user' ],
    computed: {
        displayName() {
            if(this.user.preferFullName && this.user.fullName.length) {
                return this.user.fullName;
            } else {
                return this.user.username;
            }
        }
    }
}
</script>