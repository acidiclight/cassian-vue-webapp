<template>
    <div>
        <h4>
            <b-input-group size="sm">
                <b-badge class="tag-editor-badge" variant="primary" v-for="tag in value" :key="tag">{{ tag }}</b-badge>
                <b-form-input :readonly="readonly" v-model="current" @input="onChange" @keydown="onKeyDown"></b-form-input>
            </b-input-group>
        </h4>
    </div>
</template>

<script>
const separator = /[ ,]+/;

export default {
    name: 'tag-editor',
    props: [ 'value', 'readonly' ],
    data: () => ({
        current: ''
    }),
    methods: {
        onKeyDown(evt) {
            if(evt.keyCode == 8) {
                if(!this.current) {
                    this.current = this.value.pop();
                    evt.preventDefault();
                }
            }
        },
        tagExists(newTag) {
            for(let tag of this.value) {
                if(tag == newTag) return true;
            }
            return false;
        },
        onChange(evt) {
            var matched = this.current.match(separator);
            if(matched && matched.length) {
                let fixed = this.current.replace(',', '').trim();
                if(fixed.length && !this.tagExists(fixed)) {
                    this.value.push(fixed);
                }
                else {
                    evt.preventDefault();
                }
                this.current = "";
            }

        }
    }
}
</script>

<style scoped>
.tag-editor-badge {
    margin-right: 5px;
}
</style>