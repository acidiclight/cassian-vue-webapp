<template>
    <div>
        <b-row>
            <b-col sm="3">
                <b-nav pills vertical>
                    <b-nav-text>Project settings</b-nav-text>
                    <b-nav-item :to="settingsUrl('')">General</b-nav-item>
                    <b-nav-item :to="settingsUrl('/gdd')">Design Document</b-nav-item>
                    <b-nav-item :to="settingsUrl('/team')">Team</b-nav-item>
                    <b-nav-item :to="settingsUrl('/tasks')">Tasks</b-nav-item>
                    <div v-if="isOwner">
                        <b-nav-text>Danger Zone</b-nav-text>
                        <b-nav-item variant="danger" @click="deleteProject">Delete project</b-nav-item>
                    </div>
                </b-nav>
            </b-col>
            <b-col>
                <router-view></router-view>
            </b-col>
        </b-row>
    </div>
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
