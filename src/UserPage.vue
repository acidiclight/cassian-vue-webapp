<template>
    <div>
        <b-container>
            <b-card no-body>
                <b-card-body v-if="profile.fullName.length">
                    <b-card-title>{{ profile.fullName }}</b-card-title>
                    <b-card-sub-title>{{ profile.username }}</b
                </b-card-body>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'user-page',
    computed: mapGetters(['profile', 'user', 'isAuthenticated' ])
}
</script>