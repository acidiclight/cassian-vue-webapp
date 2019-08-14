<template>
    <div>
        <b-container fluid v-if="project">
            <b-nav tabs>
                <b-nav-text>{{project.name}}</b-nav-text>
                <b-nav-item :to="projectUrl('/')" active-class="">About</b-nav-item>
                <b-nav-item :to="projectUrl('/tasks')">Taskst</b-nav-item>
                <b-nav-item :to="projectUrl('/gdd')">GDD</b-nav-item>
                <b-nav-item :to="projectUrl('/team')">Team</b-nav-item>
                <b-nav-item :to="projectUrl('/settings')" v-if="isAdmin">Settings</b-nav-item>
            </b-nav>

            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'project',
  computed: mapGetters(['user', 'isAuthenticated', 'project', 'isAdmin', 'isOwner']),
  destroyed() {
    this.$store.dispatch('forgetProject');
  },
  methods: {
    projectUrl(url) {
      return `/p/${this.$route.params.username}/${this.$route.params.project}${url}`;
    },
  },
};
</script>
