<template>
    <b-card no-body>
        <b-card-body>
            <b-card-title>Project settings</b-card-title>

            <b-nav tabs>
                <b-nav-item :to="settingsUrl('')">General</b-nav-item>
                <b-nav-item :to="settingsUrl('/gdd')">Design Document</b-nav-item>
                <b-nav-item :to="settingsUrl('/team')">Team</b-nav-item>
                <b-nav-item :to="settingsUrl('/tasks')">Tasks</b-nav-item>
            </b-nav>
            <div class="bg-dark settings-inner">
                <router-view></router-view>
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'project-settings',
  computed: mapGetters(['project', 'user', 'isAuthenticated', 'isOwner', 'isAdmin', 'isDev']),
  methods: {
    settingsUrl(url) {
      return `/p/${this.$route.params.username}/${this.$route.params.project}/settings/${url}`;
    },
    deleteProject() {

    },
  },
};
</script>

<style scoped>
.settings-inner {
    padding: 20px;
}
</style>