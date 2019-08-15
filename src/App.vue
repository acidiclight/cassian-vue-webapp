<template>
  <div id="app" :class="theme">
    <b-navbar toggleable="lg" type="dark" variant="dark" sticky>
      <b-navbar-brand to="/">Project: Cassian</b-navbar-brand>
        
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/projects">Projects</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto" v-if="isAuthenticated">
          <b-nav-item-dropdown :text="userDisplayName" right>
              <b-dropdown-item to="/profile">Profile</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>

              <!-- 'Create' group -->
              <b-dropdown-group id="create" header="Create">
                <b-dropdown-item to="/projects/create">New project</b-dropdown-item>
              </b-dropdown-group>

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-group id="account" header="Account">
                <b-dropdown-item to="/logout">Log out</b-dropdown-item>
              </b-dropdown-group>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
          <b-nav-item to="/login">Log in</b-nav-item>
          <b-nav-item to="/create-account">Create account</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item @click="toggleInsomnia" href="#" title="Toggle dark mode"><i class="fa fas fa-adjust"></i></b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
    <b-container fluid v-if="$route.query.err">
        <b-alert variant="danger" show>{{ getError() }}</b-alert>
    </b-container>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'font-awesome/css/font-awesome.css';

export default {
  name: 'app',
  computed: {
    ...mapGetters(['isAuthenticated', 'user', 'userDisplayName', 'darkMode']),
    theme() {
      return this.darkMode ? 'theme-dark' : 'theme-light';
    }
  },
  mounted() {
    this.$store.dispatch('validateUser');
    this.setDarkMode();
  },
  watch: {
    darkMode(to, from) {
      this.setDarkMode();
    }
  },
  methods: {
    setDarkMode() {
      if(this.darkMode) {
        document.getElementsByTagName('body').item(0).className = 'theme-dark';
      } else {
        document.getElementsByTagName('body').item(0).className = 'theme-light';
      }
    },
    toggleInsomnia() {
        this.$store.dispatch('toggleDarkMode');
    },
    getError() {
      switch (this.$route.query.err) {
        case 'notAdmin':
          return 'You are not an administrator of that project.';
          break;
        case 'notOwner':
          return 'You do not own that project.';
          break;
        case 'notDev':
          return 'You are not a developer of that project.';
          break;
      }
    }
  },
};
</script>
