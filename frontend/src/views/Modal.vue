<template>
  <div class="modal fade" id="enseignantModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref="enseignantModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ isEdit ? 'Modifier un enseignant' : 'Ajouter un enseignant' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="matricule">Matricule</label>
            <input required :readonly="isEdit" type="text" v-model="enseignant.matricule" class="form-control">
          </div>
          <div class="mb-3">
            <label for="nom">Nom</label>
            <input required type="text" v-model="enseignant.nom" class="form-control">
          </div>
          <div class="mb-3">
            <label for="nbHeure">Nombre d'heures</label>
            <input required type="number" v-model="enseignant.nbHeure" class="form-control">
          </div>
          <div class="mb-3">
            <label for="tauxHoraire">Taux horaires</label>
            <input required type="number" v-model="enseignant.tauxHoraire" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="handleSubmit">
            {{ isEdit ? 'Modifier' : 'Valider' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enseignant: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        this.$emit('modifier-enseignant', this.enseignant);
      } else {
        this.$emit('ajouter-enseignant', this.enseignant);
      }
      this.hideModal();
    },
    hideModal() {
      const modal = this.$refs.enseignantModal;
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    },
    showModal() {
      const modal = this.$refs.enseignantModal;
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    },
  },
};
</script>