<template>
    <b-list-group v-if="elements.length">
        <element-item v-for="element of elements" :key="element._id" :element="element"></element-item>
    </b-list-group>
</template>

<script>
import ElementItem from './ElementItem';

export default {
    name: 'element-list',
    components: {
        'element-item': ElementItem
    },
    props: [ 'elements' ]
}
</script>