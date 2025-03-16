<template>
  <div>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h4>
            Enseignants
            <button type="button" class="btn btn-primary float-end" @click="openAddModal">
              Ajouter
            </button>
          </h4>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Nombre d'heures</th>
                <th>Taux horaires</th>
                <th>Prestation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="enseignants.length > 0">
              <tr v-for="(enseignant, index) in enseignants" :key="index">
                <td>{{ enseignant.matricule }}</td>
                <td>{{ enseignant.nom }}</td>
                <td>{{ enseignant.nbHeure }}</td>
                <td>{{ enseignant.tauxHoraire }}</td>
                <td>{{ enseignant.nbHeure * enseignant.tauxHoraire }}</td>
                <td>
                  <button type="button" class="btn btn-success" @click="openEditModal(enseignant)">
                    Editer
                  </button>
                  <button type="button" class="btn btn-danger" @click="showDeleteModal(enseignant.matricule)" data-bs-toggle="modal" data-bs-target="#confirmationModal">
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr>
                <td colspan="4">Prestation Totale</td>
                <td colspan="1">{{ prestationTotal }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6">Chargement...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <ModalAjoutEnseignant
      ref="enseignantModal"
      :enseignant="model.enseignant"
      :isEdit="isEditMode"
      @ajouter-enseignant="createEnseignant"
      @modifier-enseignant="updateEnseignant"
    />
    <ModalConfirmation :enseignantToDelete="enseignantToDelete" @confirm-delete="deleteEnseignant" />
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import ModalAjoutEnseignant from './Modal.vue';
import ModalConfirmation from './ModalConfirmation.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
Chart.register(...registerables);

export default {
  name: 'Enseignants',
  components: {
    ModalAjoutEnseignant,
    ModalConfirmation,
  },
  data() {
    return {
      enseignants: [],
      prestationTotal: 0,
      model: {
        enseignant: {
          matricule: '',
          nom: '',
          nbHeure: null,
          tauxHoraire: null,
        },
      },
      enseignantToDelete: null,
      isEditMode: false, 
    };
  },
  mounted() {
    this.readEnseignant();
    this.grapheCamembert();
  },
  methods: {
    showToast(message, type = 'success') {
      toast[type](message, {
        autoClose: 1500,
        position: 'top-left',
      });
    },

    readEnseignant() {
      axios.get('http://127.0.0.1:9090/Enseignant/readEnseignant')
        .then(response => {
          this.enseignants = response.data;
          this.prestationTotal = this.enseignants.reduce((total, enseignant) => total + (enseignant.nbHeure * enseignant.tauxHoraire), 0);
          this.grapheCamembert();
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des enseignants:', error);
        });
    },

    showDeleteModal(matricule) {
      this.enseignantToDelete = matricule;
    },

    deleteEnseignant(matricule) {
      axios.delete(`http://127.0.0.1:9090/Enseignant/deleteEnseignant/${matricule}`)
        .then(() => {
          this.readEnseignant();
          this.showToast('Enseignant supprimé avec succès', 'success');
        })
        .catch(error => {
          console.error('Erreur lors de la suppression:', error);
          this.showToast('Erreur lors de la suppression de l\'enseignant', 'error');
        });
    },

    createEnseignant(enseignant) {
      axios.post('http://127.0.0.1:9090/Enseignant/createEnseignant', enseignant)
        .then(() => {
          this.readEnseignant();
          this.showToast('Enseignant ajouté avec succès', 'success');
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de l\'enseignant:', error);
          this.showToast('Erreur lors de l\'ajout de l\'enseignant', 'error');
        });
    },

    updateEnseignant(enseignant) {
      axios.put(`http://127.0.0.1:9090/Enseignant/updateEnseignant/${enseignant.matricule}`, enseignant)
        .then(() => {
          this.readEnseignant();
          this.showToast('Enseignant modifié avec succès', 'success');
        })
        .catch(error => {
          console.error('Erreur lors de la modification:', error);
          this.showToast('Erreur lors de la modification de l\'enseignant', 'error');
        });
    },

    openAddModal() {
      this.isEditMode = false;
      this.model.enseignant = { matricule: '', nom: '', nbHeure: null, tauxHoraire: null };
      this.$refs.enseignantModal.showModal();
    },

    openEditModal(enseignant) {
      this.isEditMode = true;
      this.model.enseignant = { ...enseignant };
      this.$refs.enseignantModal.showModal();
    },

    grapheCamembert() {
      if (this.enseignants.length === 0) return;
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const prestations = this.enseignants.map(e => e.nbHeure * e.tauxHoraire);
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Minimum", "Maximum", "Total"],
          datasets: [
            {
              data: [Math.min(...prestations), Math.max(...prestations), prestations.reduce((acc, val) => acc + val, 0)],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 400px;
  margin: auto;
}
</style>