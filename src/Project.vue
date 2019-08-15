<template>
    <div>
        <b-navbar variant="dark" type="dark" sticky class="sidebarToggler d-lg-none">
          <b-navbar-nav>
            <b-nav-text><strong>Project:</strong> {{ project.name }}</b-nav-text>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-text>
              <i :class="sidebarToggleIcon()"></i>
            </b-nav-text>
          </b-navbar-nav>

          <a href="#" class="d-lg-none stretched-link" @click="toggleSidebar"></a>
        </b-navbar>
        <b-container fluid v-if="project">
            
            <b-row>
              <b-col class="offset-lg-3">
                <router-view></router-view>
              </b-col>
              <b-collapse id="sidebarCollapse" class="col-lg-3 bg-dark sidebar" :visible="sidebarIsOpen">
                <b-nav pills vertical>
                  <b-nav-text class="d-none d-lg-block"><strong>Project:</strong> {{ project.owner.username }}/{{ project.name }}</b-nav-text>
                  <b-nav-item :to="projectUrl('/')" active-class="">About</b-nav-item>
                  <b-nav-item :to="projectUrl('/tasks')">Tasks</b-nav-item>
                  <b-nav-item :to="projectUrl('/gdd')">GDD</b-nav-item>
                  <b-nav-item :to="projectUrl('/team')">Team</b-nav-item>
                  <b-nav-item :to="projectUrl('/settings')" v-if="isAdmin">Settings</b-nav-item>
                </b-nav>
              </b-collapse>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'project',
  computed: mapGetters(['user', 'isAuthenticated', 'project', 'isAdmin', 'isOwner']),
  data: () => ({
    sidebarIsOpen: false
  }),
  destroyed() {
    this.$store.dispatch('forgetProject');
  },
  watch: {
    '$route': function(to, from) {
      this.sidebarIsOpen = false;
    }
  },
  methods: {
    sidebarToggleIcon() {
      return this.sidebarIsOpen ? "fa fas fa-chevron-up" : "fa fas fa-chevron-down";
    },
    projectUrl(url) {
      return `/p/${this.$route.params.username}/${this.$route.params.project}${url}`;
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    }
  },
};
</script>

<style scoped>
  .sidebar {
    height:100%;
    position: fixed;
  }

  .sidebar div {
    width:100%;
  }
  .sidebarToggler {
    color: #fff !important;
  }
  @media(min-width: 1024px) {
    .collapse.sidebar {
      display: block !important;
    }
  }

</style>