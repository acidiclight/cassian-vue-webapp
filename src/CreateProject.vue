<template>
    <b-container>
        <div v-if="hasErrors">
            <div v-for="err in errors" v-bind:key="err">
                <b-alert variant="danger" show>{{ err }}</b-alert>
            </div>
        </div>

        <h1>Create New Project</h1>

        <b-form @submit="onSubmit">
            <b-form-group id="projName" label="Project name:" for="name" description="What will your project be called?">
                <b-form-input id="name" v-model="form.name" type="text" required placeholder="My cool project"></b-form-input>
            </b-form-group>
            <b-form-group id="projAbout" label="Describe your project:" for="about" description="Describe the basics of your project.  This text is shown on your project's front page.  Markdown is supported.">
                <markdown-editor v-model="form.about"></markdown-editor>
            </b-form-group>
            <b-form-group id="basicSettings" label="Basic settings">
                <b-form-checkbox v-model="form.isPublic" value="true" unchecked-value="false">Public project</b-form-checkbox>
                <b-form-checkbox v-model="form.allowSuggestions" value="true" unchecked-value="false" v-if="form.isPublic == 'true'">Allow user suggestions</b-form-checkbox>
            </b-form-group>

            <p v-if="isBusy"><em>Creating project...</em></p>
            <b-button type="submit" variant="primary" v-else><i class="fa fa-plus"></i> Create project</b-button>
        </b-form>
    </b-container>
</template>

<script>
export default {
  name: 'create-project',
  data: () => ({
    form: {
      name: '',
      about: '',
      isPublic: 'true',
      allowSuggestions: 'true',
    },
    errors: [],
    hasErrors: false,
    isBusy: false,
  }),
  methods: {
    onSubmit(evt) {
      evt.preventDefault();

      this.errors = [];
      this.hasErrors = false;
      this.isBusy = true;

      this.$api.createProject(this.form, (err, project) => {
        if(project) {
          this.isBusy = false;
          this.$router.replace(`/p/${project.owner.username}/${project.slug}`);
        } else {
          this.isBusy = false;
          this.hasErrors = true;
          this.errors = err;
        }
      });
    },
  },
};
</script>
