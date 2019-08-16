<template>
    <div>
        <b-collapse :visible="hasErrors" id="projectTeamErrors">
            <b-alert v-for="err in errors" :key="err" variant="danger" show>
                <i class="fa fas fa-times-circle"></i> <strong> Error: </strong> {{ err }}
            </b-alert>
        </b-collapse>

        <h4>Project Owner</h4>
        <p>The project owner is the person who created the project.  They have complete access to the entire project, can create, edit, and remove anything in the project, and cannot be modified by any other user.  The project is also displayed on their profile.</p>

        <b-list-group>
            <b-list-group-item :to="memberLink(project.owner)">
                <user-avatar :user="project.owner"></user-avatar>
            </b-list-group-item>
        </b-list-group>

        <br/>

        <b-row>
            <b-col md="6">
                <h4>Administrators</h4>
                <p>Administrators are users that have almost-full access to the project.  They can invite new developers, create and edit design element types, delete design elements, remove developers, and more.</p>
                <b-list-group v-if="!admins.length">
                    <b-list-group-item>This project has no administrators.</b-list-group-item>
                </b-list-group>

                <b-list-group v-else>
                    <b-list-group-item v-for="member of admins" :key="member._id" :to="memberLink(member)">
                        <user-avatar :user="member"></user-avatar>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
            <b-col md="6">
                <h4>Developers</h4>
                <p>Developers are users that have basic write access to the project - they can create and modify their own game design elements, delete their own game design elements, and suggest edits to other design elements.</p>
                <b-list-group v-if="!devs.length">
                    <b-list-group-item>This project has no developers.</b-list-group-item>
                </b-list-group>

                <b-list-group v-else>
                    <b-list-group-item v-for="member of devs" :key="member._id" :to="memberLink(member)">
                        <user-avatar :user="member"></user-avatar>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserAvatar from '../components/UserAvatar';

export default {
    name: 'team-settings',
    components: {
        'user-avatar': UserAvatar
    },
    data: () => ({
        devs: [],
        admins: [],
        errors: [],
        hasErrors: false,
    }),
    computed: mapGetters([ 'project', 'user', 'isAdmin', 'isDev', 'isOwner', 'isAuthenticated' ]),
    mounted() {
        for(let id of this.project.admins) {
            this.$api.getUserById(id, (err, user) => {
                if(user) {
                    this.admins.push(user);
                }
            });
        }
        for(let id of this.project.devs) {
            this.$api.getUserById(id, (err, user) => {
                if(user) {
                    this.admins.push(user);
                }
            });
        }
        
    },
    methods: {
        memberLink(member) {
            return `/u/${member.username}`;
        }
    }
}
</script>