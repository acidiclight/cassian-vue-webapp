<template>
    <b-list-group-item :to="projectLink" class="flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 header-alt">{{ project.name }}</h5>
            <small>{{ project.owner.username }}/{{ project.slug }}</smalL>
        </div>
        <div class="mb-1 w-100">
            {{ project.summary }}
        </div>
        <small>
            <b-badge variant="primary" v-for="tag in project.tags" :key="tag">{{ tag }}</b-badge>
        </small>
    </b-list-group-item>
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