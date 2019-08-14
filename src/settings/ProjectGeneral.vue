<template>
    <div>
        <b-alert show variant="success" v-if="successMessage">
            <strong>Success!</strong> {{ successMessage }}
        </b-alert>

        <div v-if="hasErrors">
            <div v-for="err in errors" :key="err">
                <b-alert show variant="danger">
                    {{ err }}
                </b-alert>
            </div>
        </div>

        <h3>General settings</h3>
        <p>Change the project name, tags, and other basic metadata.</p>
        <b-form @submit="submitBasics" @reset="resetBasics">
            <b-form-group
                name="nameGroup"
                for="projName"
                label="Project name:"
                description="The name of the project as well as its URL. Only the owner is allowed to change this.">
                <b-form-input id="projName" type="text" required v-model="basics.name" :readonly="!isOwner"></b-form-input>
            </b-form-group>
            <b-form-group
              name="summaryGroup"
              for="summary"
              label="Summary:"
              description="A short description of the project displayed on its Project Card.">
              <b-form-input :readonly="!isOwner" v-model="basics.summary" id="summary" placeholder="A cool thing that does cool things."></b-form-input>
            </b-form-group>

            <b-form-group
              name="tagsGroup"
              for="tags"
              label="Tags:"
              description="Keywords that define the project.">
              <tag-editor :readonly="!isOwner" v-model="basics.tags" id="tags"></tag-editor>
            </b-form-group>

            <b-form-group
                name="descGroup"
                for="projAbout"
                label="Description:"
                description="What is the project about? Only the project owner can edit this.">
                <markdown-editor v-if="isOwner" v-model="basics.description"></markdown-editor>
                <markdown v-else :content="basics.description"></markdown>
            </b-form-group>

            <b-button-group size="sm" v-if="isOwner">
                <b-button type="submit" variant="primary">Save Changes</b-button>
                <b-button type="reset">Discard</b-button>
            </b-button-group>
        </b-form>
        <hr/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TagEditor from '../components/TagEditor';

export default {
  name: 'project-settings-main',
  components: {
    'tag-editor': TagEditor
  },
  data: () => ({
    basics: {
      name: '',
      description: '',
      summary: '',
      tags: []
    },
    successMessage: null,
    hasErrors: false,
    errors: [],
  }),
  computed: mapGetters(['user', 'isAuthenticated', 'isAdmin', 'isOwner', 'project']),
  mounted() {
    this.resetBasics();
  },
  methods: {
    submitBasics(evt) {
      evt.preventDefault();

      this.hasErrors = false;
      this.errors = [];
      this.successMessage = null;

      this.$api.editProjectInfo(
        this.$route.params.username,
        this.$route.params.project,
        this.basics,
        (err, p) => {
          if (p) {
            if (p.name != this.project.name) {
              this.$store.dispatch('updateProject', p).then(() => {
                this.$router.replace(`/p/${this.$route.params.username}/${p.slug}/settings`);
                this.successMessage = 'Project name changed successfully.';
              });
            } else {
              this.$store.dispatch('updateProject', p).then(() => {
                this.successMessage = 'Project info has been updated.';
              });
            }
          } else {
            this.hasErrors = true;
            this.errors = err;
          }
        },
      );
    },
    resetBasics(evt) {
      if (evt) evt.preventDefault();

      this.basics.name = this.project.name;
      this.basics.description = this.project.about;
      this.basics.tags = this.project.tags;
      this.basics.summary = this.project.summary;
    },
  },
};
</script>
