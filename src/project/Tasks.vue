<template>
    <div>
        <b-collapse id="fetchErrors" :visible="fetchErrors.length > 0">
            <b-alert variant="danger" show v-for="err in fetchErrors" :key="err"><strong><i class="fa fa-times-circle"></i> Error:</strong> {{ err }}</b-alert>
        </b-collapse>

        <b-row>
            <b-col class="kanban">
                <div class="kanban-inner" @mousedown.left="startDrag" @mouseup.left="endDrag" v-on:mousemove="drag" id="kanbanBoard">
                    <b-card title="Pending">
                        <b-list-group>
                            <task :task="t" v-for="t in tasks" :key="t._id"></task>
                        </b-list-group>
                    </b-card>
                </div>
            </b-col>
            <b-col lg="6" v-if="currentTask" class="offset-lg-6">
                <br/>
                <b-card bg-variant="dark" :title="currentTask.name">
                    <!-- task info -->
                    <dl>
                        <b-row>
                            <b-col>
                                <dt>ID:</dt>
                                <dd>#{{ currentTask.friendlyId }}</dd>
                            </b-col>
                            <b-col>
                                <dt>Author:</dt>
                                <dd><user-avatar :user="currentTask.author"></user-avatar></dd>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <dt>Status</dt>
                                <dd>{{ currentTask.status }}</dd>
                            </b-col>
                            <b-col>
                                <dt>Design element</dt>
                                <dd v-if="currentTask.element">
                                    <router-link :to="elementLink">{{ currentTask.element.name }}</router-link>
                                </dd>
                                <dd v-else>
                                    None
                                </dd>
                            </b-col>
                        </b-row>
                    </dl>
                </b-card>
                <br/>
                <b-card title="Description" bg-variant="dark">
                    <markdown :content="currentTask.description"></markdown>
                </b-card>
            </b-col>
        </b-row>

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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Task from '../components/Task';
import UserAvatar from '../components/UserAvatar'

export default {
    name: 'tasks',
    components: {
        'task': Task,
        'user-avatar': UserAvatar,
    },
    data: () => ({
        tasks: [],
        newTask: {
            name: '',
            description: '',
            element: null,
        },
        createAndContinue: 'false',
        isBusy: false,
        fetchErrors: [],
        hasErrors: false,
        errors: [],
        isDragging: false,
    }),
    computed: {
        ...mapGetters(['project', 'isAuthenticated', 'isDev', 'isOwner', 'isAdmin', 'user', 'currentTask' ]),
        elementLink() {
            return `/p/${this.project.owner.username}/${this.project.slug}/gdd/${this.currentTask.element._id}`;
        }
    },
    mounted() {
        this.fetchTasks();
    },
    watch: {
        $route (to, from) {
            this.$api.getTask(this.project, this.$route.params.id, (err, task) => {
                if(task) {
                    this.$store.dispatch('setTask', task);
                } else {
                    this.$store.dispatch('setTask', null);
                }
            });
        },
    },
    methods: {
        startDrag(evt) {
            evt.preventDefault();

            this.isDragging = true;
        },
        endDrag(evt) {
            evt.preventDefault();
            
            this.isDragging = false;
        },
        drag(evt) {
            evt.preventDefault();

            if(this.isDragging) {
                document.getElementById('kanbanBoard').scrollLeft -= evt.movementX; // Essentially emulating a touch-style horizontal scroll.
            }
        },
        fetchTasks() {
            this.tasks = [];
            this.$api.getTasks(this.project, (err, tasks) => {
                if(tasks) {
                    for(let task of tasks) {
                        this.tasks.push(task);
                    }
                } else {
                    this.fetchErrors = err;
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
                    this.cancelCreateTask();
                    if(this.createAndContinue == 'true') {
                        this.openTaskModal();
                    } else {
                        this.$router.replace(`/p/${this.project.owner.username}/${this.project.slug}/tasks/{task.friendlyId}`);
                    }
                } else {
                    this.hasErrors = true;
                    this.errors = err;
                }
            });
        },
        cancelCreateTask() {
            this.$bvModal.hide('createTask');
        },
        setTask(task) {
            this.task = task;
        }
    }
}
</script>

<style scoped>
.kanban {
    position: fixed;
    height: 100%;
}

.kanban-inner {
    overflow-x: auto;
    white-space: nowrap;
    height: 100%;
}

.kanban-inner > .card {
    display: inline-block;
    float: none;
}
</style>