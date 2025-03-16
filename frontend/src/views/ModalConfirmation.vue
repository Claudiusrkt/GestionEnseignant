<template>
  <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true" ref="confirmationModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmationModalLabel">Confirmer la suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Êtes-vous sûr de vouloir supprimer cet enseignant ?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Non</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">Oui</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    enseignantToDelete: String,
  },
  methods: {
    confirmDelete() {
      this.$emit('confirm-delete', this.enseignantToDelete);
      this.hideModal();
    },
    hideModal() {
      const modal = this.$refs.confirmationModal;
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    },
  },
};
</script>

<style scoped>
</style>