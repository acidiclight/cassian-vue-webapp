import { POINT_CONVERSION_COMPRESSED } from "constants";

const API = function (http, baseUrl) {
  this.$http = http;
  this.$base = baseUrl;

  this.interceptHttpRequests();
};

API.prototype.interceptHttpRequests = function() {
  this.$http.interceptors.request.use((config) => {
    // get the JWT.
    const jwt = localStorage.getItem('user-token');
    if (jwt) config.headers.Authorization = jwt;
    return config;
  });  
}

API.prototype.get = function (url) {
    console.log('GET: ' + url);
  return this.$http.get(this.$base + url);
};

API.prototype.post = function (url, payload) {
    console.log('POST: ' + url);
  return this.$http.post(this.$base + url, payload);
};

API.prototype.getUserById = function(id, cb) {
    this.get(`/users/id/${id}`)
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.user);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
}

API.prototype.getUser = function (username, cb) {
  this.get(`/users/username/${username}`)
    .then((response) => {
      if (response.data.user) {
        return cb(null, response.data.user);
      } else {
        return cb(null, false);
      }
    })
    .catch((error) => {
      return cb(error, false);
    });
};

API.prototype.getProject = function (username, project, cb) {
  this.get(`/projects/${username}/${project}`)
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.project);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
};

API.prototype.getAllProjects = function (start, max, cb) {
  this.get(`/projects?start=${start}&max=${max}`)
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.projects);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
};

API.prototype.getProjects = function (username, cb) {
  this.get(`/projects/${username}`)
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.projects);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
};

API.prototype.getCurrentUser = function (cb) {
  this.get('/auth/userinfo')
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.user);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
};

API.prototype.login = function (email, password, cb) {
  this.post('/auth/login', { email, password })
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.token);
      } else {
        cb(null, false);
      }
    })
    .catch((error) => {
      cb(error, false);
    });
};

API.prototype.editProjectInfo = function (username, project, form, cb) {
  this.post(`/projects/${username}/${project}/edit`, form)
    .then((response) => {
      if (response.data.success) {
        cb(null, response.data.project);
      } else {
        cb(response.data.errors, false);
      }
    })
    .catch((error) => {
      cb(['An unexpected error has occurred.'], false);
    });
};

API.prototype.createAccount = function (form, cb) {
  this.post('/auth/create-user', form)
    .then((response) => {
      if (response.data.success) {
        this.login(form.email, form.password, cb);
      } else {
        cb(response.data.errors, false);
      }
    })
    .catch(() => {
      cb(['An unexpected error has occurred.'], false);
    });
};

export default API;
