<template>
    <div class="d-inline-block">
        <b-img v-b-tooltip.hover :title="displayName" v-if="user.avatarURL && user.avatarURL.length" :src="user.avatarURL" circle></b-img>
        <i v-b-tooltip.hover :title="displayName" class="fa fas fa-user-circle" v-else></i>&nbsp;
        <div class="d-inline" v-if="!noText">
            {{ displayName }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'user-avatar',
    props: {
        'user': Object,
        'noText': {
            type: Boolean,
            default: false
        }
    },
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