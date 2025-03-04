<style scoped>
.chart-container {
  max-width: 400px;
  margin: auto;
}
</style>

<template>
 <div class="container">
  <div class="card">
    <div class="card-header">
      <h4>
        enseingants
        <RouterLink to="/ajout" class="btn btn-primary float-end"> 
          Ajouter
        </RouterLink>
      </h4>
    </div>
    <div class="card-body">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Nombre d'heures</th>
            <th>taux horaires</th>
            <th>Prestation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="this.enseignants.length > 0">
          <tr v-for="(enseignant) in this.enseignants" :key="index">
            <td>{{ enseignant.matricule }}</td>
            <td>{{ enseignant.nom }}</td>
            <td>{{ enseignant.nbHeure }}</td>
            <td>{{ enseignant.tauxHoraire }}</td>
            <td> {{ enseignant.nbHeure * enseignant.tauxHoraire }}</td>
            <td>
              <RouterLink :to="{ path: '/'+enseignant.matricule+'/edit'}" class="btn btn-success">Editer</Routerlink>
              <button type="button" class="btn btn-danger" @click="deleteEnseignant(enseignant.matricule)">
                Supprimer
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="4"> Prestation Totale</td>
            <td colspan="1">{{ prestationTotal }} </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5">
              Chargement...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'Enseignants',
  data() {
    return {
      enseignants: [],
      prestationTotal: 0,
    };
  },
  mounted() {
    this.readEnseignant();
    this.grapheCamembert();
  },
  methods: {
    readEnseignant() {
      axios.get('http://127.0.0.1:9090/Enseignant/readEnseignant') 
        .then(response => {
          this.enseignants = response.data;
          console.log(this.enseignants);
          this.enseignants.forEach(enseignant => {
          this.prestationTotal += (enseignant.nbHeure * enseignant.tauxHoraire);
          this.grapheCamembert();
    });
        })
        .catch(error => {
          console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
        });
    },
    deleteEnseignant(matricule) {
      if(confirm("Voulez vous vraiment supprimer?")){
        axios.delete('http://127.0.0.1:9090/Enseignant/deleteEnseignant/'+matricule) 
        .then(response => {
          console.log(response);
          this.readEnseignant();
        })
        .catch(error => {
          console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
        });
      }
    },
    grapheCamembert() {
  if (this.enseignants.length === 0) return;
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Calcul du minimum, maximum et total
  const prestations = this.enseignants.map(e => e.nbHeure * e.tauxHoraire);
  const minPrestation = Math.min(...prestations);
  const maxPrestation = Math.max(...prestations);
  const totalPrestation = prestations.reduce((acc, val) => acc + val, 0);

  const ctx = this.$refs.chartCanvas.getContext("2d");

  this.chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Minimum", "Maximum", "Total"],
      datasets: [
        {
          data: [minPrestation, maxPrestation, totalPrestation],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}
,
  },
}

</script>

