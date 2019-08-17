<template>
    <div>
        <b-row>
          <b-col class="p-3" lg="6">
            <div class="flex-column align-items-start">
              <div class="d-flex justify-content-between">
                <b-card-title>Design Document <a href="#" v-b-toggle.howDoesThisWork title="How does this work?"><i class="fa fa-question-circle"></i></a></b-card-title>
                <b-card-title v-if="isDev"><b-link href="#" @click="showElementModal"><i class="fa fa-plus-circle"></i></b-link></b-card-title>
              </div>
            </div>

            <b-collapse id="howDoesThisWork">
              <h5>How does this work?</h5>
              <p>Your <strong>Game Design Document</strong> is essentially a detailed outline of every feature, system and gameplay mechanic in your game and how they should all work.  Since these documents can get out of hand really quickly, Cassian makes them easier to edit by splitting it into <strong>elements.</strong></p>
              <p>Each <strong>design element</strong> represents a single feature, system, or gameplay mechanic in the game.  Elements are treated just like folders on a hard drive, and thus they can contain sub-elements in a tree-like view.  They can also be assigned to <strong>element types,</strong> such as "Menu", "Enemy", "Folder", etc.  Elements can also contain Markdown content just like the project README.</p>
              <h6>Suggestions</h6>
              <div v-if="isOwner">
                <p>If enabled in <router-link :to="projectLink('/settings')">Settings</router-link>, your project's game design document can accept <strong>user suggestions</strong>.  This allows other users of Cassian to suggest new elements for your game.  You and other members of your <router-link :to="projectLink('/team')">team</router-link> can approve or deny these suggestions.</p>
                <small>Note: This feature requires the project to be Public.</small>
              </div>
              <div v-else>
                <p>If enabled by the project's owner, you can suggest new elements to this project's design doc.  Project team members are able to approve and deny these suggestions.</p>
              </div>
              <br/>
              <h6>Learn more</h6>
              <p>For a complete description of all of the features in Project: Cassian's Design Document Editor, see the <b-link href="https://wiki.bitphoenixsoftware.com/index.php/Design_Document_Editor">Design Document Editor</b-link> wiki article.</p>
            </b-collapse>

            <div class="text-center" v-if="!elements.length">
              <h4>No design elements</h4>
              <p v-if="isDev">Your game design document is currently empty and has no design elements.  Start by creating the first element.</p>
              <p v-else>This project has no game design elements to display.</p>
              <b-button v-if="isDev" @click="showElementModal()" variant="primary"><i class="fa fas fa-plus"></i> Create new element</b-button>
            </div>
            <b-list-group v-else>
              <element-item :element="el" v-for="el in elements" :key="el._id"></element-item>
            </b-list-group>
          </b-col>
          <b-col class="p-3" v-if="currentElement" lg="6">
            <b-card bg-variant="dark" :title="currentElement.element.name">
                <dl>
                  <b-row>
                    <b-col>
                      <dt>ID</dt>
                      <dd><code>{{ currentElement.element._id }}</code></dd>
                    </b-col>
                    <b-col>
                      <dt>Author</dt>
                      <dd><user-avatar :user="currentElement.element.author"></user-avatar></dd>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <dt>Element type</dt>
                      <dd><i :class="currentElement.element.elementType.icon"></i> {{ currentElement.element.elementType.label }}</dd>
                    </b-col>
                    <b-col>
                      <dt>Parent</dt>
                      <dd v-if="currentElement.element.parent">
                        <b-link :to="projectLink(`/gdd/${currentElement.element.parent._id}`)">
                          <strong><i :class="currentElement.element.parent.elementType.icon"></i> {{ currentElement.element.parent.elementType.label }}:</strong> {{ currentElement.element.parent.name }}
                        </b-link>
                      </dd>
                      <dd v-else>
                        None
                      </dd>
                    </b-col>
                  </b-row>
                </dl>
            </b-card>
            <hr/>
            <b-card bg-variant="dark" title="Content">
              <b-card-text>
                <markdown :content="currentElement.element.content"></markdown>
              </b-card-text>
            </b-card>
          </b-col>
        </b-roW>

        <b-form>
          <b-modal title="Create Design Element" id="createElement" size="lg" centered>
            <b-collapse id="errorList" :visible="hasErrors">
              <b-alert v-for="err in errors" :key="err" variant="danger" show>
                <i class="fa fa-times-circle"></i> <strong> Error:</strong>{{ err}}
              </b-alert>
            </b-collapse>
            
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
                  <b-form-select v-model="newElement.parent" :options="parentOptions"></b-form-select>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Element type:"
                  description="What type of element is this?"
                  for="elementType"
                  name="parentGroup">
                  <b-form-select v-model="newElement.type" :options="typeOptions"></b-form-select>
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
              
              <b-button @click="resetElement"><i class="fa fas fa-times"></i> Cancel</b-button>
              <b-button @click="createElement" variant="primary"><i class="fa fas fa-check"></i> Create element</b-button>
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
import ElementItem from '../components/ElementItem.vue';
import UserAvatar from '../components/UserAvatar';

export default {
  name: 'design-doc',
  computed: mapGetters(['project', 'currentElement', 'isOwner', 'isAdmin', 'isDev', 'user', 'isAuthenticated' ]),
  components: {
    'element-item': ElementItem,
    'user-avatar': UserAvatar,
  },
  data: () => ({
    elementTree: {},
    elements: [],
    newElement: {
      name: '',
      content: '',
      type: null,
      parent: null,
    },
    settings: {
      createAndContinue: 'false',
      rememberElement: 'false'
    },
    types: [],
    parentOptions: [],
    typeOptions: [],
    isBusy: false,
    errors: [],
    hasErrors: false
  }),
  watch: {
    $route (to, from) {
      this.$api.getElement(this.project, this.$route.params.el, (err, el) => {
        if(el) {
          this.$store.dispatch('setElement', el);
        } else {
          this.$store.dispatch('setElement', null);
        }
      });
    },
  },
  mounted() {
    this.fetchElementTypes();
    this.fetchElementTree();
  },
  methods: {
    fetchElementTree() {
      this.elementTree = [];

      this.$api.getElements(this.project, (err, elements) => {
        if(elements) {
          for(let element of elements) {
            this.addElement(element);
          }
        }
      });
    },
    addElement(element) {
      if(!element.parent) {
        this.elements.push(element);
        if(!this.elementTree['<none>'])
          this.elementTree['<none>'] = [];
        this.elementTree['<none>'].push(element);
      } else {
        if(!this.elementTree[element.parent._id]) {
          this.elementTree[element.parent._id] = [];
        }
        this.elementTree[element.parent._id].push(element);
      }

      // Fetch element children.
      this.$api.getElement(this.project, element._id, (err, el) => {
        if(el.children) {
          for(let child of el.children) {
            this.addElement(child);
          }
        }
      });
    },
    fetchElementTypes() {
      this.types = [];
      this.typeOptions = [];
      this.$api.getElementTypes(this.project, (err, types) => {
        if(types) {
          for(let type of types) {
            this.types.push(type);
            this.typeOptions.push({ value: type._id, text: type.label });
          }
          this.newElement.type = this.types[0]._id;
        }
      });
    },
    buildParentOptions() {
      this.parentOptions = [
        {
          text: 'None',
          value: null,
        }
      ];

      for(let root of this.elementTree['<none>']) {
        this.addParentOption(0, root);
      }
    },
    addParentOption(level, el) {
      let name = '  '.repeat(level) + el.elementType.label + ": " + el.name;
      this.parentOptions.push({ value: el._id, text: name });
      if(this.elementTree[el._id]) {
        for(let child of this.elementTree[el._id]) {
          this.addParentOption(level + 1, child);
        }
      }
    },
    projectLink(url) {
      return `/p/${this.project.owner.username}/${this.project.slug}${url}`;
    },
    createElement() {
      this.isBusy = true;
      this.errors = [];
      this.hasErrors = false;
      
      this.$api.createElement(this.project, this.newElement, (err, element) => {
        this.isBusy = false;
        if(element) {
          this.saveElementData();
          this.$bvModal.hide('createElement');
          if(this.settings.createAndContinue == 'true') {
            this.showElementModal();
          } else {
            this.$router.replace(this.projectLink('/gdd/' + element._id));
          }
        } else {
          this.hasErrors = true;
          this.errors = err;
        }
      });
    },
    resetElement() {
      this.newElement.name = '';
      this.newElement.content = '';
      this.newElement.type = this.types[0]._id;
      this.newElement.parent = null;
    },
    saveElementData() {
      if(this.settings.rememberElement == 'true') {
        localStorage.setItem('rememberedElementName', this.newElement.name);
        localStorage.setItem('rememberedElementContent', this.newElement.content);
        localStorage.setItem('rememberedElementType', this.newElement.type);
        localStorage.setItem('rememberedElementParent', this.newElement.parent);
      }
    },
    showElementModal() {
      this.buildParentOptions();
      this.restoreElementForm();
      this.$bvModal.show('createElement');
    },
    restoreElementForm() {
      this.newElement.name = '';
      this.newElement.content = '';
      this.newElement.type = this.types[0]._id;
      this.newElement.parent = null;

      if(this.settings.rememberElement == 'true') {
        this.newElement.name = localStorage.getItem('rememberedElementName');
        this.newElement.content = localStorage.getItem('rememberedElementContent');

        let typeId = localStorage.getItem('rememberedElementType');
        for(let type of this.types) {
          if(type._id == typeId) {
            this.newElement.type = type;
          }
        }

        let parentId = localStorage.getItem('rememberedElementParent');
        for(let parentOption of this.parentOptions) {
          if(parentOption.value == parentId) {
            this.newElement.parent = parentId;
          }
        }

        localStorage.removeItem('rememberedElementName');
        localStorage.removeItem('rememberedElementContent');
        localStorage.removeItem('rememberedElementType');
        localStorage.removeItem('rememberedElementParent');
      }
    }
  }
};
</script>
