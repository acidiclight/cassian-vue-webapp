<template>
    <div>
        <b-card no-body bg-variant="dark" text-variant="white">
            <b-card-body>
                <b-link class="stretched-link" :to="projectLink"></b-link>
                <b-card-title>{{ project.name }}</b-card-title>
                <b-card-sub-title>A project by <em>{{ ownerName }}</em></b-card-sub-title>
                <b-card-text>
                    {{ projectSummary }}
                </b-card-text>
            </b-card-body>
            <b-card-footer>
                <strong>Tags: </strong>
                <div v-if="project.tags.length">
                    <div v-for="tag in project.tags" :key="tag">
                        <b-badge variant="primary">{{ tag }}</b-badge>
                    </div>
                </div>
                <em v-else>None</em>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'project-card',
    props: [ 'project' ],
    computed: {
        ownerName() {
            if(this.project.owner.preferFullName && this.project.owner.fullName)
                return this.project.owner.fullName;
            else
                return this.project.owner.username;
        },
        projectLink() {
            return `/p/${this.project.owner.username}/${this.project.slug}`;
        },
        projectSummary() {
            return this.project.summary || 'This project has no summary.';
        }
    }
}
</script>