<template>
    <div class="d-inline-block">
        <b-button variant="primary" @click="openIconModal"><i :class="value"></i></b-button>

        <b-modal title="Select icon" center size="lg" :id="modalId">
            <b-form-group
                for="search"
                name="searchGroup"
                label="Search:">
                <b-form-input v-model="search" @change="updateSearch" id="search" placeholder="Search..."></b-form-input>
            </b-form-group>

            <b-row v-if="searched.length">
                <b-col v-for="icon of searched" :key="icon" cols="1">
                    <b-button :variant="variant(icon)" @click="setIcon(icon)">
                        <big>
                            <i :class="iconClass(icon)"></i>
                        </big>
                    </b-button>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col v-for="icon of iconset.fontawesome4.icons" :key="icon" cols="1">
                    <b-button :variant="variant(icon)" @click="setIcon(icon)">
                        <big>
                            <i :class="iconClass(icon)"></i>
                        </big>
                    </b-button>
                </b-col>
            </b-row>

            <template slot="modal-footer"></template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'icon-picker',
    props: [ 'value' ],
    data: () => ({
        iconset: {
            fontawesome4: {
                // I only want a subset of the icons being loaded, loading the full pack = perf. issues - Michael
                icons: [
                    'fa-folder',
                    'fa-file',
                    'fa-file-o',
                    'fa-folder-open',
                    'fa-folder-open-o',
                    'fa-trash',
                    'fa-trash-o',
                    'fa-bold',
                    'fa-bug',
                    'fa-cog',
                    'fa-cogs',
                    'fa-user',
                    'fa-user-o',
                    'fa-user-secret',
                    'fa-users',
                    'fa-user-plus',
                    'fa-plus',
                    'fa-minus',
                    'fa-times',
                    'fa-check',
                    'fa-plus-circle',
                    'fa-minus-circle',
                    'fa-times-circle',
                    'fa-check-circle',
                    'fa-plus-square',
                    'fa-minus-square',
                    'fa-check-square',
                    'fa-lock',
                    'fa-unlock',
                    'fa-star',
                    'fa-star-half',
                    'fa-star-o',
                    'fa-code',
                    'fa-list',
                    'fa-list-ol',
                    'fa-list-ul',
                    'fa-gamepad',
                    'fa-github',
                    'fa-gitlab',
                    'fa-eye',
                    'fa-eye-slash',
                ]
            },
        },
        modalId: '',
        search: '',
        searched: [],
    }),
    methods: {
        updateSearch() {
            if(this.search.length) {
                this.searched = [];
                for(let icon of this.iconset.fontawesome4.icons) {
                    if(icon.match(this.search)) {
                        this.searched.push(icon);
                    }
                }
            } else {
                this.searched = [];
            }
        },
        variant(icon) {
            if(this.iconClass(icon) == this.value.toString()) {
                return 'primary';
            } else {
                return 'dark';
            }
        },
        iconClass(icon) {
            return 'fa ' + icon;
        },
        setIcon(icon) {
            this.value = this.iconClass(icon);
            this.$bvModal.hide(this.modalId);
        },
        openIconModal() {
            this.search = '';
            this.searched = [];
            this.$bvModal.show(this.modalId);
        }
    },
    mounted () {
        this.modalId = 'iconpicker-modal-' + this._uid;
    }
}
</script>