<template>
    <b-card title="Tasks">
        <b-button v-if="isDev" @click="openTaskModal" variant="primary" size="sm"><i class="fa fa-plus"></i> Create new</b-button>
        <b-table striped hover :items="tasks"></b-table>

        <b-form v-if="isDev">
            <b-modal size="lg" title="Create task" id="createTask">
                <b-collapse id="taskErrors" :visible="hasErrors">
                    <b-alert variant="danger" show v-for="err in errors" :key="err"><strong><i class="fa fa-times-circle"></i> Error:</strong> {{ err }}</b-alert>
                </b-collapse>
                
                <b-form-group
                    name="nameGroup"
                    for="name"
                    label="Name:"
                    description="What is the task going to be called?">
                    <b-form-input v-model="newTask.name" id="name" required placeholder="Enter task name..."></b-form-input>
                </b-form-group>

                <b-form-group
                    name="descriptionGroup"
                    for="description"
                    label="Description:">
                    <markdown-editor v-model="newTask.description" id="description"></markdown-editor>
                </b-form-group>
                
                <template slot="modal-footer">
                    <b-form-checkbox class="mr-auto" v-model="createAndContinue" value="true" unchecked-value="false">Create and continue</b-form-checkbox>
                    <b-button @click="cancelCreateTask" variant="secondary"><i class="fa fa-times"></i> Cancel</b-button>
                    <b-button @click="createTask" variant="primary"><i class="fa fa-check"></i> Create task</b-button>
                </template>
            </b-modal>
        </b-form>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'tasks',
    data: () => ({
        tasks: [],
        newTask: {
            name: '',
            description: '',
            element: null,
        },
        createAndContinue: 'false',
        isBusy: false,
        hasErrors: false,
        errors: [],
    }),
    computed: mapGetters(['project', 'isAuthenticated', 'isDev', 'isOwner', 'isAdmin', 'user' ]),
    mounted() {
        this.fetchTasks();
    },
    methods: {
        fetchTasks() {
            this.tasks = [];
            this.$api.getTasks(this.project, (err, tasks) => {
                if(tasks) {
                    for(let task of tasks) {
                        this.tasks.push(task);
                    }
                }
            });
        },
        openTaskModal() {
            this.newTask.name = '';
            this.newTask.description = '';
            this.newTask.element = null;

            this.$bvModal.show('createTask');
        },
        createTask() {
            this.$api.createTask(this.project, this.newTask, (err, task) => {
                this.isBusy = false;
                if(task) {
                    this.tasks.push(task);
                    this.task = task;
                    this.cancelCreateTask();
                } else {
                    this.hasErrors = true;
                    this.errors = err;
                }
            });
        },
        cancelCreateTask() {
            this.$bvModal.hide('createTask');
        }
    }
}
</script>