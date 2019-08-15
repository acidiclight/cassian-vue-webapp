<template>
    <b-card title="Team">
        <b-list-group>
            <b-list-group-item v-for="member in members" :key="member._id" :to="memberLink(member)">
                <user-avatar :user="member"></user-avatar>
            </b-list-group-item>
        </b-list-group>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import UserAvatar from '../components/UserAvatar';

export default {
    name: 'team',
    computed: mapGetters(['user', 'isAuthenticated', 'project', 'isDev', 'isAdmin', 'isOwner']),
    components: {
        'user-avatar': UserAvatar
    },
    data: () => ({
        members: [],
        uids: [],
    }),
    mounted() {
        this.members.push(this.project.owner);
        this.uids.push(this.project.owner._id);

        this.fetchMembers(this.project.devs);
        this.fetchMembers(this.project.admins);
    },
    methods: {
        fetchMembers(uidList) {
            for(let uid of uidList) {
                if(this.uids.contains(uid)) {
                    continue;
                }
                this.uids.push(uid);
                this.$api.getUserById(uid, (err, user) => {
                    if(user) {
                        this.members.push(user);
                    }
                });
            }
        },
        memberLink(member) {
            return '/u/' + member.username;
        }
    }
}
</script>