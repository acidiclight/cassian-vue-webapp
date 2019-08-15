<template>
    <div>
        <h1>Team</h1>
        <p>This project has the following team members:</p>

        <ul v-for="member of members" :key="member._id">
            <li><router-link :to="memberLink(member)">{{ member.username }}</router-link></li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'team',
    computed: mapGetters(['user', 'isAuthenticated', 'project', 'isDev', 'isAdmin', 'isOwner']),
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