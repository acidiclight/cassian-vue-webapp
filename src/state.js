import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    token: localStorage.getItem('user-token'),
    status: '',
    user: null,
    project: null
};

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const mutations = {
    setToken(s, payload) {
        let token = payload.token;
        localStorage.setItem('user-token', token);
        s.token = token;
        s.user = parseJwt(token);
    },
    logout(s) {
        s.token = '';
        s.user = null;
        localStorage.removeItem('user-token');
    },
    setUser(s, user) { s.user = user; },
    setProject(s, project) { s.project = project; },
    forgetProject(s) { s.project = null; }
}

const API_GETUSER = "http://localhost:3000/auth/userinfo";

const actions = {
    login(context, payload) {
        context.commit('setToken', payload);
    },
    logout(context) {
        context.commit('logout');
    },
    validateUser(context) {
        Vue.prototype.$http.get(API_GETUSER)
            .then((response) => {
                context.commit('setUser', response.data);
            })
            .catch((error) => {
                context.commit('logout');
            });
    },
    requireAuth(context, payload)
    {
        let {to,from,next} = payload;

        if(!!context.state.token) {
            context.state.user = parseJwt(context.state.token);
            return next();
        }
        else
            return next({path: '/login', query: { redirect: to.fullPath }});
    },
    fetchProject(context, payload)
    {
        let { user, project } = payload;

        let API_PROJECT_URL = 'http://localhost:3000/projects/' + user + '/' + project;

        Vue.prototype.$http.get(API_PROJECT_URL)
            .then((response) => {
                if(response.data.success)
                {
                    context.commit('setProject', response.data.project);
                }
                else
                {
                    context.commit('forgetProject');
                }
            })
            .catch((error) => {
                context.commit('forgetProject');
            });
    },
    forgetProject(context) {
        context.commit('forgetProject');
    },
    updateProject(context, project) {
        context.commit('setProject', project);
    },
    requireOwner (context, payload) {
        let {to, from, next} = payload;
        if(isOwner(context.state))
        {
            return next();
        }
        else {
            return next(from.path + '?err=notOwner');
        }
    },
    requireAdmin (context, payload) {
        let {to, from, next} = payload;
        if(isAdmin(context.state))
        {
            return next();
        }
        else {
            return next(from.path + '?err=notAdmin');
        }
    },
    requireDev (context, payload) {
        let {to, from, next} = payload;
        if(isDev(context.state))
        {
            return next();
        }
        else {
            return next(from.path + '?err=notDev');
        }
    }
}

// Project access control on the client side.
function isOwner(s)
{
    if(!s.user) return false;
    if(!s.project) return false;

    return s.project.owner == s.user._id;
}

function isAdmin(s) {
    return (s.user && s.project) && (isOwner(s) || s.project.admins.contains(s.user._id));
}

function isDev(s)
{
    return (s.user && s.project) && (isAdmin(s) || s.project.devs.contains(s.user._id));
}

const getters = {
    isAuthenticated(s) { return !!s.token && s.user; },
    status(s) { return s.status; },
    user(s) { return s.user; },
    project(s) { return s.project; },
    userDisplayName(s) {
        if(!s.user) return '';

        if(s.user.fullName && s.user.preferFullName) return s.user.fullName;
        return s.user.username;
    },
    isOwner,
    isAdmin,
    isDev
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
