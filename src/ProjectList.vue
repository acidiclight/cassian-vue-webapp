<template>
    <div>
        <b-container>
            <h1>All projects</h1>
            <p>A list of every project you're able to see.</p>
            <hr/>

            <div v-if="projects.length">
                <b-list-group>
                    <project-card v-for="project in projects" :key="project._id" :project="project"></project-card>
                </b-list-group>
            </div>
            <div v-else>
                <h4>No projects found!</h4>
                <p>Unfortunately, no projects could be displayed because none were found that match the search query.</p>
            </div>
        </b-container>
    </div>
</template>

<script>
import ProjectCard from './components/ProjectCard.vue';

export default {
    name: 'project-list',
    components: {
        'project-card': ProjectCard
    },
    data: () => ({
        projects: [],
        fetching: true
    }),
    beforeMount() {
        this.getNewBatch();
    },
    mounted() {
        window.onscroll = this.scroll;
    },
    methods: {
        scroll () {
            if(this.fetching) return;

            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight;

            if (bottomOfWindow) {
                this.fetching = true;
                this.getNewBatch();
            }
        },
        getNewBatch() {
            this.$api.getAllProjects(this.projects.length, 25, (err, batch) => {
                for(let p of batch) {

                    this.projects.push(p);
                }
                this.fetching = false;
                window.onscroll = this.scroll;
            });
        }
    }
}
</script>