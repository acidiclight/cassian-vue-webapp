<template>
    <div>
        <b-container>
            <b-card no-body>
                <b-card-header v-if="profile.fullName.length">
                    <b-card-title>{{ profile.fullName }}</b-card-title>
                    <b-card-sub-title>{{ profile.username }}</b-card-sub-title>
                </b-card-header>
                <b-card-header v-else>
                    <b-card-title>{{ profile.username }}</b-card-title>
                </b-card-header>

                <b-card-body>
                    <b-tabs content-class="bg-dark p-3">
                        <b-tab title="Profile" active>
                            <b-row>
                                <b-col md="3">
                                    <h4>Basic info</h4>
                                    <p>Not yet implemented.</p>
                                    <h4 v-if="hasLinks()">Links</h4>
                                    <b-list-group flush v-if="hasLinks()">
                                        <b-list-group-item :href="github()" v-if="profile.githubURL.length">
                                            <i class="Fa fas fa-github"></i> {{ profile.githubURL }}
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-col>
                                <b-col>
                                    <h4>About me</h4>
                                    <div v-if="profile.about.length">
                                        <markdown :content="profile.about"></markdown>
                                    </div>
                                    <div v-else>
                                        <div v-if="isCurrentUser()">
                                            <p>Your profile seems to have a case of Acute Hypobiographemia. You do not have anything to display here.  Why don't you tell others about yourself in this section?</p>
                                        </div>
                                        <div v-else>
                                            <p>This user doesn't have anything to display here.  It seems as though they're suffering from Acute Hypobiographemia.</p>
                                        </div>
                                    </div>

                                    <a href="#" @click="showEditModal" v-if="isCurrentUser()">
                                        <i class="fa fas fa-pencil"></i> Edit my About section
                                    </a>
                                </b-col>
                            </b-row>
                        </b-tab>
                        <b-tab title="Projects">
                            <h4>Projects</h4>
                            <p>These are all of the projects that this user owns that are either public or you have access to.</p>
                            <b-list-group>
                                <project-card :project="project" v-for="project in profileProjects" :key="project._id"></project-card>
                            </b-list-group>
                        </b-tab>
                    </b-tabs>
                </b-card-body>
            </b-card>

            <b-modal title="About Me" id="editModal" v-if="isCurrentUser()" size="lg">
                <div v-if="hasErrors">
                    <b-alert v-for="err in errors" :key="err" variant="danger" show>
                        <i class="fa fas fa-times-circle"></i> <strong>Error: </strong> {{ err }}
                    </b-alerT>
                </div>
                
                <markdown-editor v-model="edit.about"></markdown-editor>

                <template slot="modal-footer" v-if="!isBusy">
                    <b-button @click="dismissEditModal()"><i class="fa fas fa-times"></i> Cancel</b-button>
                    <b-button variant="primary" @click="submitAbout"><i class="fa fas fa-check"></i> Update</b-button>
                </template>
                <template slot="modal-footer" v-else>
                    Updating profile...
                </template>
            </b-modal>
        </b-container>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProjectCard from './components/ProjectCard'

export default {
    name: 'user-page',
    components: {
        'project-card': ProjectCard
    },
    computed: mapGetters(['profile', 'user', 'isAuthenticated' ]),
    data: () => ({
        edit: {
            about: '',
        },
        profileProjects: [],
        isBusy: false,
        errors: [],
        hasErrors: false
    }),
    mounted() {
        this.$api.getProjects(this.profile.username, (err, ps) => {
            if(ps) {
                for(let project of ps) {
                    this.profileProjects.push(project);
                }
            } 
        });
    },
    methods: {
        hasLinks() {
            return this.profile.githubURL.length || this.profile.websiteURL.length;
        },
        github() {
            return `https://github.com/${this.profile.githubURL}`
        },
        isCurrentUser() {
            if(this.isAuthenticated) {
                return this.user._id == this.profile._id;
            } else {
                return false;
            }
        },
        showEditModal() {
            this.edit.about = this.profile.about || '';

            this.$bvModal.show('editModal');
        },
        dismissEditModal() {
            this.$bvModal.hide('editModal');
        },
        submitAbout(evt) {
            evt.preventDefault();

            this.hasErrors = false;
            this.errors = [];
            this.isBusy = true;

            this.$api.editProfile(this.edit, (err, u) => {
                if(u) {
                    this.$store.dispatch('setProfile', u).then(() => {
                        this.$store.dispatch('validateUser').then(() => {
                            this.isBusy = false;
                            this.$bvModal.hide('editModal');
                        });
                    });
                } else {
                    this.errors = [ 'An error occurred updating your profile.' ];
                    this.hasErrors = true;
                    this.isBusy = false;
                }
            });
        },
        projectLink(project) {
            return `/p/${project.owner.username}/${project.slug}`;
        }
    }
}
</script>