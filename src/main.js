import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueSimplemde from 'vue-simplemde';
import API from './api';

import App from './App.vue';
import Home from './Home.vue';
import CreateProject from './CreateProject';
import state from './state';
// Let's make this fucker a single-page app.
import CreateAccount from './CreateAccount.vue';
import 'simplemde/dist/simplemde.min.css';
import './theme.scss';
import Login from './Login.vue';
import Project from './Project.vue';
import Markdown from 'markdown-it-vue';
// Project pages.
import About from './project/About.vue';
import DesignDoc from './project/DesignDoc.vue';
import Tasks from './project/Tasks.vue';
import Team from './project/Team.vue';
import Settings from './project/Settings.vue';
import IAmATeapot from './404.vue';

// Project settings
import ProjectSettingsGeneral from './settings/ProjectGeneral.vue';
import ProjectSettingsTasks from './settings/ProjectTasks.vue';
import ProjectSettingsTeam from './settings/ProjectTeam.vue';
import ProjectSettingsDesignDoc from './settings/ProjectGDD.vue';

// User pages
import UserPage from './UserPage.vue';

// project list
import ProjectList from './ProjectList.vue';

import Axios from 'axios';

Vue.prototype.$http = Axios;

Vue.use(VueRouter);
Vue.use(BootstrapVue);


Vue.component('markdown-editor', VueSimplemde);
Vue.component('markdown', Markdown);

Vue.config.productionTip = false;

const requireAuth = (to, from, next) => {
  state.dispatch('requireAuth', { to, from, next });
};

const requireAdmin = (to, from, next) => {
  requireAuth(to, from, (url) => {
    if (!url) {
      state.dispatch('requireAdmin', { to, from, next });
    } else {
      next(url);
    }
  });
};

const requireOwner = (to, from, next) => {
  state.dispatch('requireOwner', { to, from, next });
};

const requireDev = (to, from, next) => {
  state.dispatch('requireDev', { to, from, next });
};

const fetchProject = (to, from, next) => {
  Vue.prototype.$api.getProject(to.params.username, to.params.project, (err, project) => {
    if (project) {
      state.dispatch('updateProject', project).then(() => {
        next();
      });
    } else {
      next('/404');
    }
  });
};

const fetchUser = function(to, from, next) {
  Vue.prototype.$api.getUser(to.params.username, function(err, user) {
    if(user) {
      state.dispatch('setProfile', user).then(() => {
        next();
      });
    } else {
      next('/404');
    }
  });
}

const noElement = function(to, from, next) {
  state.dispatch('setElement', null).then(() => {
    next();
  });
}

const clearTask = function(to, from, next) {
  state.dispatch('setTask', null).then(() => {
    next();
  });
}

const fetchTask = function(to, from, next) {
  Vue.prototype.$api.getTask(state.state.project, to.params.id, (err, task) => {
    if(task) {
      state.dispatch('setTask', task).then(() => {
        next();
      });
    } else {
      next('/404');
    }
  });
}

const fetchElement = function(to, from, next) {
  Vue.prototype.$api.getElement(state.state.project, to.params.el, (err, el) => {
    if(el) {
      state.dispatch('setElement', el).then(() => {
        next();
      });
    } else {
      next('/404');
    }
  });
}

const routes = [
  { path: '/', component: Home },
  { 
    path: '/projects',
    component: ProjectList,
  },
  { path: '/projects/create', component: CreateProject, beforeEnter: requireAuth },
  { path: '/login', component: Login },
  { path: '/u/:username', component: UserPage, beforeEnter: fetchUser },
  { path: '/create-account', component: CreateAccount },
  {
    path: '/p/:username/:project',
    component: Project,
    beforeEnter: fetchProject,
    children: [
      { path: '', component: About },
      { path: 'gdd', beforeEnter: noElement, component: DesignDoc },
      { path: 'gdd/:el', beforeEnter: fetchElement, component: DesignDoc },
      { path: 'tasks', component: Tasks, beforeEnter: clearTask, },
      { path: 'tasks/:id', component: Tasks, beforeEnter: fetchTask, },
      { path: 'team', component: Team },
      {
        path: 'settings',
        component: Settings,
        beforeEnter: requireAdmin,
        children: [
          { path: '', component: ProjectSettingsGeneral },
          { path: 'tasks', component: ProjectSettingsTasks },
          { path: 'team', component: ProjectSettingsTeam },
          { path: 'gdd', component: ProjectSettingsDesignDoc },
        ],
      },
    ],
  },
  {
    path: '/logout',
    beforeEnter(to, from, next) {
      state.dispatch('logout').then(() => {
        next('/');
      });
    },
  },
  { path: '/404', component: IAmATeapot },
  {
    path: '*',
    beforeEnter(to, from, next) {
      next('/404');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
});

Vue.prototype.$api = new API(Vue.prototype.$http, 'http://localhost:3000');

new Vue({
  router,
  store: state,
  render: h => h(App),
}).$mount('#app');
