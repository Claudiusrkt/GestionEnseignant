<template>
    <div class="container mt-5">
      <div class="card">
        <div class="card-header">
          <h4>Ajouter un enseignant</h4>
        </div>
        <div class="card-body">
              <div class="mb-3">
              <label for="matricule">Matricule</label>
              <input required readonly type="text"  name="matricule" v-model="model.enseignant.matricule" class="form-control">
            </div>
            <div class="mb-3">
              <label for="nom">Nom</label>
              <input required type="text"  name="nom" v-model="model.enseignant.nom" class="form-control">
            </div>
            <div class="mb-3">
              <label for="nbHeure">Nombre d'heures</label>
              <input required type="number" name="nbHeure" v-model="model.enseignant.nbHeure" class="form-control">
            </div>
            <div class="mb-3">
              <label for="tauxhr">Taux horaires</label>
              <input required type="number" name="tauxhr" v-model="model.enseignant.tauxHoraire" class="form-control">
            </div>
            <div class="mb-3">
              <button type="button" @click="updateEnseignant" class="btn btn-primary"> Enregistrer</button>
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
        },
        enseignants: [],

      };
    },mounted() {
      
      console.log(this.$route.params.matricule);
      this.readEnseignant();
    },
    methods: {
      readEnseignant() {
  axios.get('http://127.0.0.1:9090/Enseignant/readEnseignant') 
    .then(response => {
      this.enseignants = response.data;
      console.log(this.enseignants);
      const enseignantfind = this.enseignants.find(enseignant => enseignant.matricule == this.$route.params.matricule);
      
      if (enseignantfind) {
        // console.log(enseignantfind.nom);
        // console.log(enseignantfind.nbHeure);
        // console.log(enseignantfind.tauxHoraire);
        this.model.enseignant = {
          matricule: enseignantfind.matricule,
          nom: enseignantfind.nom,
          nbHeure: enseignantfind.nbHeure,
          tauxHoraire: enseignantfind.tauxHoraire
        }
      } else {
        console.log("Aucun enseignant trouvé avec ce matricule.");
      }
    })
    .catch(error => {
      console.error('Il y a eu une erreur lors de la récupération des enseignants:', error);
    });
}
,
updateEnseignant() {
      axios.put('http://127.0.0.1:9090/Enseignant/updateEnseignant/'+this.$route.params.matricule,this.model.enseignant) 
        .then(response => {
          alert("MAJ avec succés")
      })
        .catch(error => {
          console.error('Il y a eu une erreur lors de la création', error);
        });
    }

  }
};
  </script>
  
  