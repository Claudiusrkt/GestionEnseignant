<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Ajouter un enseignant</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Matricule</label>
          <input required type="text" v-model="model.enseignant.matricule" class="form-control">
        </div>
        <div class="mb-3">
          <label for="">Nom</label>
          <input required type="text" v-model="model.enseignant.nom" class="form-control">
        </div>
        <div class="mb-3">
          <label for="">Nombre d'heures</label>
          <input required type="number" v-model="model.enseignant.nbHeure" class="form-control">
        </div>
        <div class="mb-3">
          <label for="">Taux horaires</label>
          <input required type="number" v-model="model.enseignant.tauxHoraire" class="form-control">
        </div>
        <div class="mb-3">
          <button type="button" @click="createEnseignant" class="btn btn-primary"> Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Enseignantcreate',
  data() {
    return {
      model: {
        enseignant: {
          matricule: '',
          nom: '',
          nbHeure: null,
          tauxHoraire: null
        }
      }
    };
  },
  methods: {
    createEnseignant() {
      axios.post('http://127.0.0.1:9090/Enseignant/createEnseignant',this.model.enseignant) 
        .then(response => {
          // this.enseignants = response.data;
          // console.log(response);
          // alert(response.data.message);
          this.model.enseignant = {
          matricule: '',
          nom: '',
          nbHeure: null,
          tauxHoraire: null
        }
      })
        .catch(error => {
          console.error('Il y a eu une erreur lors de la création', error);
        });
    }
  }
};
</script>

