<template>
    <div>
        <b-row>
            <b-col>
                <b-card
                    title="About project"
                    :img-src="project.coverURL"
                    tag="article"
                    img-top>
                    <b-card-text>
                        <markdown :content="project.about"></markdown>

                        <div v-if="isOwner">
                            <hr/>
                            <a href="#" @click="showEditModal">Edit description</a>
                        </div>
                    </b-card-text>
                </b-card>
            </b-col>
            <b-col md="3">
                <b-card bg-variant="secondary" text-variant="white"
                    title="Basic info">
                    <b-card-text>
                        <h6>Tags</h6>
                        <div v-if="project.tags.length">
                            <div v-for="tag in project.tags" v-bind:key="tag">
                                <b-badge variant="primary">{{ tag }}</b-badge>
                            </div>
                        </div>
                        <div v-else>
                            <em>This project has no tags.</em>
                        </div>
                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>

        <!-- 'edit description' modal. -->
        <b-modal size="xl" id="editDescription" v-if="isOwner" title="Edit Description">
            <div v-if="hasErrors">
                <div v-for="err in errors" v-bind:key="err">
                    <b-alert show variant="danger">
                        {{ err }}
                    </b-alert>
                </div>
            </div>
            <b-form-group id="descriptionGroup"
                for="description"
                label="Description:">
                <markdown-editor v-model="edit.description"></markdown-editor>
            </b-form-group>
            <template slot="modal-footer">
                <p v-if="isBusy"><em>Updating project...</em></p>
                <b-button v-else @click="updateDescription" variant="primary">Change</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'about-project',
  data: () => ({
    edit: { description: '' },
    isBusy: false,
    errors: [],
    hasErrors: false,
  }),
  computed: mapGetters(['isAuthenticated', 'user', 'project', 'isOwner']),
  methods: {
    updateDescription() {
      this.isBusy = true;
      this.hasErrors = false;
      this.errors = [];

      this.$api.editProjectInfo(
        this.$route.params.username,
        this.$route.params.project,
        this.project.name,
        this.edit.description,
        (err, p) => {
          if (p) {
            this.$store.dispatch('updateProject', p).then(() => {
              this.isBusy = false;
              this.$bvModal.hide('editDescription');
            });
          } else {
            this.isBusy = false;
            this.hasErrors = true;
            this.errors = err;
          }
        },
      );
    },
    showEditModal() {
      if (this.isBusy) return;

      this.isBusy = false;
      this.errors = [];
      this.hasErrors = false;

      this.edit.description = this.project.about;

      this.$bvModal.show('editDescription');
    },
  },
};
</script>
