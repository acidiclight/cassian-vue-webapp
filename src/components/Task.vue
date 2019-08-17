<template>
    <b-list-group-item class="flex-column align-items-start" :active="selected">
        <div class="d-flex justify-content-between">
            <p class="w-100 mb-1">#{{ task.friendlyId }} <strong>{{ task.name }}</strong></p>
            <user-avatar class="ml-2" :user="task.author" no-text></user-avatar>
        </div>
        <router-link :to="taskLink" class="stretched-link"></router-link>
    </b-list-group-item>
</template>

<script>
import { mapGetters } from 'vuex';
import UserAvatar from './UserAvatar';

export default {
    name: 'task',
    props: [ 'task' ],
    components: {
        'user-avatar': UserAvatar
    },
    computed: {
        ...mapGetters(['project', 'currentTask']),
        taskLink() {
            return `/p/${this.project.owner.username}/${this.project.slug}/tasks/${this.task.friendlyId}`;
        },
        selected() {
            return this.currentTask && this.currentTask._id == this.task._id;
        }
    },

}
</script>