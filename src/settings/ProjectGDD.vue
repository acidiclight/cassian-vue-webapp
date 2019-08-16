<template>
    <div>
        <b-collapse id="gddErrorsCollapse" :visible="hasErrors">
            <b-alert v-for="err in errors" :key="err" variant="danger" show>
                <i class="fa fas fa-times-circle"></i>
                <strong> Error: </strong>
                {{ err }}
            </b-alert>
        </b-collapse>

        <b-row>
            <b-col md="6">
                <h4>Element types</h4>
                <p>Below is a list of all design element types for this project.  All design elements must have an element type.  Every project must have the universal <strong>Folder</strong> type.</p>

                <b-list-group>
                    <b-list-group-item v-for="type of elementTypes" :key="type._id" class="flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                            <strong class="mb-1"><i :class="type.icon"></i> {{ type.label }}</strong>
                            <a href="#" @click="deleteType(type)" v-if="isAdmin"><i class="fa fas fa-trash"></i></a>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
            <b-col md="6">
                <div v-if="isAdmin">
                    <h4>Add element type</h4>
                    <p>Select an icon and name the new element type:</p>

                    <b-form @submit="createElementType">
                        <b-input-group>
                            <icon-picker v-model="newType.icon"></icon-picker>
                            <b-form-input v-model="newType.label" required placeholder="Element type label..."></b-form-input>
                            <b-button variant="primary" type="submit"><i class="fa fas fa-check"></i> Add</b-button>
                        </b-input-group>
                    </b-form>
                </div>
            </b-col>
        </b-row>

        <b-modal v-if="isAdmin" id="deleteType" centered>
            <template slot="modal-title" v-if="typeToDelete">
                Delete "{{ typeToDelete.label }}"?
            </template>

            <p>Are you sure you want to delete this element type? Any design elements assigned to this type will be assigned to "Folder."</p>
            <small>Note: You cannot delete the "Folder" element.</small>

            <template slot="modal-footer">
                <b-button @click="cancelDelete"><i class="fa fas fa-times"></i> Cancel</b-button>
                <b-button variant="danger" @click="confirmDelete"><i class="fa fas fa-check"></i> Delete element</b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import IconPicker from '../components/IconPicker';

export default {
    name: 'gdd-settings',
    components: {
        'icon-picker': IconPicker
    },
    data: () => ({
        hasErrors: false,
        errors: [],
        elementTypes: [],
        typeToDelete: null,
        newType: {
            label: '',
            icon: 'fa fa-folder'
        },
    }),
    computed: mapGetters(['project', 'isAdmin']),
    mounted() {
        this.fetchElementTypes();
    },
    methods: {
        fetchElementTypes() {
            this.elementTypes = [];
            this.$api.getElementTypes(this.project, (err, types) => {
                if(types) {
                    this.elementTypes = types;
                } else {
                    this.hasErrors = true;
                    this.errors.push('Could not retrieve element types list.');
                }
            });
        },
        createElementType(evt) {
            evt.preventDefault();

            this.errors = [];
            this.hasErrors = false;

            this.$api.createElementType(this.project, this.newType, (err, type) => {
                if(type) {
                    this.elementTypes.push(type);
                    this.newType.icon = 'fa fa-folder';
                    this.newType.label = '';
                } else {
                    this.hasErrors = true;
                    this.errors = err;
                }
            });
        },
        deleteType(type) {
            if(this.isAdmin && type) {
                this.hasErrors = false;
                this.errors = [];
                
                this.typeToDelete = type;
                this.$bvModal.show('deleteType');
            }
        },
        confirmDelete() {
            this.$api.deleteElementType(this.typeToDelete, (err, success) => {
                if(success) {
                    this.typeToDelete = null;
                    this.fetchElementTypes();
                } else {
                    this.hasErrors = true;
                    this.errors = err;
                }

                this.typeToDelete = null;
                this.$bvModal.hide('deleteType');
            });
        },
        cancelDelete() {
            this.typeToDelete = null;
            this.$bvModal.hide('deleteType');
        },
    }
}
</script>