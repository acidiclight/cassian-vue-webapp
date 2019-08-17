<template>
    <div>
        <b-list-group-item :to="elemLink" :active="isSelected" class="flex-column align-items-start">
            <div class="d-flex justify-content-between">
                <p class="mb-0"><strong><i :class="element.elementType.icon"></i> {{ element.elementType.label}}:</strong> {{ element.name }}</p>
                <div class="mb-0">
                    <user-avatar :user="element.author" no-text></user-avatar>
                    <b-badge variant="secondary" v-if="!element.approved">SUGGESTION</b-badge>
                    <b-badge variant="primary" pill>{{ children.length }}</b-badge>
                </div>
            </div>
        </b-list-group-item>
        <b-list-group class="ml-2" v-if="isExpanded">
            <element-item v-for="element of children" :key="element._id" :element="element"></element-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserAvatar from './UserAvatar';
import ElementList from './ElementList';

export default {
    name: 'element-item',
    props: [ 'element' ],
    components: {
        'user-avatar': UserAvatar,
        'element-list': ElementList
    },
    computed: {
        isSelected () {
            return this.currentElement && this.element._id == this.currentElement.element._id;
        },
        ...mapGetters(['project', 'currentElement']),
        elemLink () {
            return `/p/${this.project.owner.username}/${this.project.slug}/gdd/${this.element._id}`;
        },
        isExpanded() {
            if(this.isSelected) {
                return true;
            }
            if(this.currentElement) {
                for(let parent of this.currentElement.parents) {
                    if(parent == this.element._id) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    data: () => ({
        children: [],
    }),
    mounted() {
        this.$api.getElement(this.project, this.element._id, (err, el) => {
            if(el.children) {
                for(let child of el.children) {
                    this.children.push(child);
                }
            }
        });
    },

}
</script>