import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  token: localStorage.getItem('user-token'),
  status: '',
  user: null,
  project: null,
  viewingProfile: null,
  darkMode: !!localStorage.getItem('darkMode'),
  element: null,
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

const mutations = {
  setElement(s, element) {
    s.element=  element;
  },
  setToken(s, payload) {
    const { token } = payload;
    localStorage.setItem('user-token', token);
    s.token = token;
    s.user = parseJwt(token);
  },
  toggleDarkMode(s) {
    s.darkMode = !s.darkMode;
    if(s.darkMode) {
      localStorage.setItem('darkMode', 'insomnia');
    } else {
      localStorage.removeItem('darkMode');
    }
  },
  setProfile(s, profile) {
    s.viewingProfile = profile;
  },
  logout(s) {
    s.token = '';
    s.user = null;
    localStorage.removeItem('user-token');
  },
  setUser(s, user) { s.user = user; },
  setProject(s, project) { s.project = project; },
  forgetProject(s) { s.project = null; },
};

const actions = {
  setElement(context, element) {
    context.commit('setElement', element);
  },
  login(context, payload) {
    context.commit('setToken', payload);
  },
  toggleDarkMode(context) {
    context.commit('toggleDarkMode');
  },
  setProfile(context, profile) {
    context.commit('setProfile', profile);
  },
  logout(context) {
    context.commit('logout');
  },
  validateUser(context) {
    Vue.prototype.$api.getCurrentUser((err, user) => {
      if (user) {
        context.commit('setUser', user);
      } else {
        context.commit('logout');
      }
    });
  },
  requireAuth(context, payload) {
    const { to, from, next } = payload;

    if (context.state.token) {
      context.state.user = parseJwt(context.state.token);
      return next();
    }
    return next({ path: '/login', query: { redirect: to.fullPath } });
  },
  fetchProject(context, payload) {
    const { user, project } = payload;

    Vue.prototype.$api.getProject(user, project, (err, p) => {
      if (p) {
        context.commit('setProject', p);
      } else {
        context.commit('forgetProject');
      }
    });
  },
  forgetProject(context) {
    context.commit('forgetProject');
  },
  updateProject(context, project) {
    context.commit('setProject', project);
  },
  requireOwner(context, payload) {
    const { to, from, next } = payload;
    if (isOwner(context.state)) {
      return next();
    }

    return next(`${from.path}?err=notOwner`);
  },
  requireAdmin(context, payload) {
    const { to, from, next } = payload;
    if (isAdmin(context.state)) {
      return next();
    }

    return next(`${from.path}?err=notAdmin`);
  },
  requireDev(context, payload) {
    const { to, from, next } = payload;
    if (isDev(context.state)) {
      return next();
    }

    return next(`${from.path}?err=notDev`);
  },
};

// Project access control on the client side.
function isOwner(s) {
  if (!s.user) return false;
  if (!s.project) return false;

  return s.project.owner['_id'] == s.user._id;
}

function isAdmin(s) {
  if(!!s.user) {
    if(isOwner(s)) {
      return true;
    } else {
      for(let admin of s.project.admins) {
        if(admin == s.user._id) {
          return true;
        }
      }
      return false;
    }
  } else {
    return false;
  }
}

function isDev(s) {
  if(!!s.user) {
    if(isAdmin(s)) {
      return true;
    } else {
      for(let dev of s.project.devs) {
        if(dev == s.user._id) {
          return true;
        }
      }
      return false;
    }
  } else {
    return false;
  }
}

const getters = {
  isAuthenticated(s) { return !!s.token && s.user; },
  status(s) { return s.status; },
  user(s) { return s.user; },
  project(s) { return s.project; },
  currentElement(s) { return s.element; },
  userDisplayName(s) {
    if (!s.user) return '';

    if (s.user.fullName && s.user.preferFullName) return s.user.fullName;
    return s.user.username;
  },
  isOwner,
  isAdmin,
  isDev,
  profile (s) { return s.viewingProfile; },
  darkMode(s) { return s.darkMode; }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
