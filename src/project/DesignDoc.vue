<template>
    <div>
        <b-row>
          <b-col class="p-3">
            <b-card-title>Design Document</b-card-title>

            <div class="text-center" v-if="!elementTree.length">
              <h4>No design elements</h4>
              <p v-if="isDev">Your game design document is currently empty and has no design elements.  Start by creating the first element.</p>
              <p v-else>This project has no game design elements to display.</p>
              <b-button v-if="isDev" v-b-modal.createElement variant="primary"><i class="fa fas fa-plus"></i> Create new element</b-button>
            </div>
          </b-col>
          <b-col class="bg-dark p-3" v-if="element">

          </b-col>
        </b-roW>

        <b-form @submit="createElement" @reset="resetElement" v-if="isDev">
          <b-modal title="Create Design Element" id="createElement" size="lg" centered>
            <b-form-group
              name="nameGroup"
              for="name"
              label="Element name:"
              description="What will the new element be called?">
              <b-form-input v-model="newElement.name" id="name" placeholder="Enter element name" required></b-form-input>
            </b-form-group>

            <b-form-row>
              <b-col>
                <b-form-group
                  label="Parent:"
                  description="The element that will own this new element."
                  for="parent"
                  name="parentGroup">
                  <!-- nyi -->
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Element type:"
                  description="What type of element is this?"
                  for="elementType"
                  name="parentGroup">
                  <!-- nyi -->
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-group
              name="contentGroup"
              label="Content:">
              <markdown-editor v-model="newElement.content"></markdown-editor>
            </b-form-group>

            <template slot="modal-footer" v-if="!isBusy">
              <b-form-checkbox id="createAndContinue" v-model="settings.createAndContinue" value="true" unchecked-value="false">Create and continue</b-form-checkbox>
              <b-form-checkbox class="mr-auto" id="rememberElement" v-model="settings.rememberElement" value="true" unchecked-value="false">Remember values</b-form-checkbox>
              
              <b-button type="reset"><i class="fa fas fa-times"></i> Cancel</b-button>
              <b-button type="submit" variant="primary"><i class="fa fas fa-check"></i> Create element</b-button>
            </template>
            <template slot="modal-footer" v-else>
              Creating new element...
            </template>
          </b-modal>
        </b-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'design-doc',
  computed: mapGetters(['project', 'isOwner', 'isAdmin', 'isDev', 'user', 'isAuthenticated' ]),
  data: () => ({
    element: null,
    elementTree: [],
    newElement: {
      name: '',
      content: '',
    },
    settings: {
      createAndContinue: 'false',
      rememberElement: 'false'
    },
    isBusy: false,
    errors: [],
    hasErrors: false
  }),
  methods: {
    createElement(evt) {
      evt.preventDefault();
    },
    resetElement() {
      evt.preventDefault();
    }
  }
};
</script>
