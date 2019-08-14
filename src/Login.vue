<template>
    <div>
        <b-container>
            
            <b-alert variant="danger" show v-if="$route.query.redirect">
                You must be logged in to access this page.
            </b-alert>

            <div v-if="hasErrors">
                <div v-for="err in errors" v-bind:key="err">
                    <b-alert variant="danger" show>{{ err }}</b-alert>
                </div>
            </div>

            <h1>Log in</h1>
            <p>Log in to Cassian to access additional features.</p>

            <b-form @submit="onSubmit">
                <b-form-group
                        name="usernameGroup"
                        label="Email:"
                        for="email">
                    <b-form-input type="email" v-model="form.email" id="email" placeholder="foo@bar.net" required></b-form-input>
                    <small>Don't have an account? <router-link to="/create-account">Create one!</router-link></small>
                </b-form-group>
                <b-form-group
                        name="passwordGroup"
                        label="Password:"
                        for="password">
                    <b-form-input type="password" v-model="form.password" id="password" required></b-form-input>
                    <small><router-link to="/login/recovery">Forgot password?</router-link></small>
                </b-form-group>

                <p v-if="isLoggingIn"><em>Please wait...</em></p>

                <b-button type="submit" variant="primary" v-else>Log in</b-button>

            </b-form>
        </b-container>
    </div>
</template>

<script>
const API_URL = "http://localhost:3000/auth/login";

export default {
    name: 'login',
    data: () => ({
        form: {
            email: '',
            password: ''
        },
        hasErrors: false,
        errors: [],
        isLoggingIn: false
    }),
    methods: {
        onSubmit(evt) {
            evt.preventDefault();

            this.hasErrors = false;
            this.errors = [];
            this.isLoggingIn = true;

            this.$http.post(API_URL, this.form)
                .then((response) => {
                    this.isLoggingIn = false;
                    if(response.data.success)
                    {
                        this.$store.dispatch('login', { token: response.data.token })
                            .then(() => {
                                this.$router.replace(this.$route.query.redirect || '/');
                            });
                    }
                    else {
                        this.errors = response.data.errors;
                        this.hasErrors = true;
                    }
                })
                .catch((error) => {
                    this.isLoggingIn = false;
                    this.errors = [ 'The username or password is invalid.' ];
                    this.hasErrors = true;
                });
        }
    }
}
</script>