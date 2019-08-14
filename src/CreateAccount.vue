<template>
    <div>
        <b-container>
            <div v-if="hasErrors">
                <div v-for="err in errors" v-bind:key="err">
                    <b-alert variant="danger" show>{{err}}</b-alert>
                </div>
            </div>

            <h1>Create an account</h1>

            <b-form @submit="onSubmit">
                <b-row>
                    <b-col>
                        <b-form-group
                            name="emailGroup"
                            for="email"
                            label="Email:"
                            description="We will never share your email with anyone.">
                            <b-form-input id="email" type="email" v-model="form.email" placeholder="foo@bar.net" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group
                            name="confirmEmailGroup"
                            for="confirmEmail"
                            label="Confirm email:"
                            description="Just to be safe, let's enter it again.">
                            <b-form-input id="confirmEmail" type="email" v-model="form.confirmEmail" placeholder="foo@bar.net" required></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group
                            name="passwordGroup"
                            for="password"
                            label="Password:"
                            description="Try to make it really hard to guess, even for a computer.">
                            <b-form-input id="password" type="password" v-model="form.password" required></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group
                            name="confirmPasswordGroup"
                            for="confirmPassword"
                            label="Enter it again:"
                            description="Just so we know you know what it is.">
                            <b-form-input id="confirmPassword" type="password" v-model="form.confirmPassword" required></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-form-group
                    name="usernameGroup"
                    for="username"
                    label="Username:"
                    description="The name that others will know you as.">
                    <b-form-input type="text" v-model="form.username" placeholder="Enter username here..." id="username" required></b-form-input>
                </b-form-group>

                <p v-if="isBusy"><em>Creating account...</em></p>
                <b-button type="submit" variant="primary" v-else>Create account</b-button>
            </b-form>
        </b-container>
    </div>
</template>

<script>
const API_URL = 'http://localhost:3000/auth/create-user';
const API_LOGIN_URL = 'http://localhost:3000/auth/login';

export default {
  name: 'create-account',
  data: () => ({
    form: {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      username: '',
    },
    hasErrors: false,
    errors: [],
    isBusy: false,
  }),
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      this.hasErrors = false;
      this.isBusy = true;
      this.errors = [];

      this.$http.post(API_URL, this.form)
        .then((response) => {
          if (response.data.success) {
            // Now we need to log the user in.
            this.$http.post(API_LOGIN_URL, {
              email: this.form.email,
              password: this.form.password,
            }).then((loginResponse) => {
              if (loginResponse.data.success) {
                this.$store.dispatch('login', { token: loginResponse.data.token })
                  .then(() => {
                    this.$router.replace('/');
                  });
              } else {
                this.isBusy = false;
                this.errors = ['A fatal error has occurred.  We have no fucking clue what the fuck just happened.'];
                this.hasErrors = true;
              }
            })
              .catch((loginError) => {
                this.isBusy = false;
                this.errors = ['A fatal error has occurred.  We have no fucking clue what the fuck just happened.'];
                this.hasErrors = true;
              });
          } else {
            this.errors = response.data.errors;
            this.hasErrors = true;
            this.isBusy = false;
          }
        })
        .catch((error) => {
          this.isBusy = false;
          this.hasErrors = true;
          this.errors = ['An unexpected error has occurred.'];
        });
    },
  },
};
</script>
