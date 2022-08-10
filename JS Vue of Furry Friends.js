/* Read Me: 
This is a web app intended for the user tp introduce lisa more furry friends and play (treat or prank) with them. The user can type in a new furry friend's information on the left hand side of the app (name, type of animal, and a URL input box to updata a picture of the animal). After the user hit submit, the data will be instantaneously passed into the database and show up on the screen (right hand side). After clicking the "Submit" button. the user will also get an alert message to instruct them how to use this page. Animals on the right-hand side of the page are sorted by their "love" value. The one with a higher "love" appears on the top. The added animal will have a "love" property of 5 by default. The user can increase the value of "love" by giving the furry friend "treat" via clicking "Got Treat?" or reduce the value by clicking "Got Prank". When the value of love is greated than 9, the background color of this animal's profile picture will change into hot pink. If the animal's love value is lower than 3, its profile picture's background color will turn into grey.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import {
	getFirestore,
  collection,
  updateDoc,
  addDoc,
  getDocs,
  onSnapshot,
  query,// etc. etc.
  orderBy,
  doc
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyDK0l-u9adwYzZtIxS-9TLanOTEyM-tORc",
  authDomain: "lisa-s-furry-friends.firebaseapp.com",
  projectId: "lisa-s-furry-friends",
  storageBucket: "lisa-s-furry-friends.appspot.com",
  messagingSenderId: "826633389778",
  appId: "1:826633389778:web:15b4e99fdb0517de2c8f0b",
  measurementId: "G-XJ2FSFCYRP"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

// VUE BOILERPLATE -------------------- //
//create document reference
const animalsRef= collection(db, "animals");

const App = Vue.createApp({
	data() {
		return {
      animals:[],
      newName:"",
      newType:"",
      newPic:"",
    };
	},
	computed: {},
	methods: {
   createNew(){
        addDoc(animalsRef, {
        name: this.newName,
        type: this.newType,
        picture: this.newPic,
        love: 5
      });
      this.newName = "";
      this.newType = "";
      this.newPic = "";
      alert("Well Well! Thank you for introducing Lisa a new furry friend. You can click the 'Got Treat' button to increase their love towards you. You can also click the 'Got Prank' button to prank them. But be careful!!! ")
   }
  },
	mounted() {
         let q = query(animalsRef, orderBy("love", "desc"));
      //I decide to use the real-time-fetch of firebase data
          this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      //ubsubscribe: kill the application
      const animalsList = [];
      querySnapshot.forEach((doc) => {
        animalsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      this.animals = animalsList;
    });
  },
   unmounted() {
     //stop listening
    this.unsubscribe();
  }
});

App.component("profile", {
	props: ["animal"],
	data() {
		return {};
	},
  computed:{
    changeColor(){
      if(this.animal.love<3){
        return "#e4d5b7" 
      }else if(this.animal.love>9){
        return "#FFF2E6"
      }else{
        return ""
      }
    }
  },
	template: `
        <div class="profile" :style="{backgroundColor:changeColor}">
          <img :src="animal.picture" alt="animal">
          <p>Name: {{animal.name}} </p>
          <p>Type: {{animal.type}} </p>
          <p>❤️: {{animal.love}} </p>
          <button button type="button" class="btn btn-outline-warning like" @click="addLove">Got Treat? 🍭</button>
          <button button type="button" class="btn btn-outline-dark bye" @click="lessLove">Got Prank? 👻</button>
        </div>
       <!--end of component template--> 
  `,
  methods:{
    //after click "got treat" button, the "love" that the furry friend has towards the user will increase
    addLove(){
  let docRef = doc(db, "animals", this.animal.id);
      updateDoc(docRef, {
       love: this.animal.love+=1
      });
    },
    //after click "got prank" button, the "love" that the furry friend has towards the user will decrease
    lessLove(){
     let docRef = doc(db, "animals", this.animal.id);
      updateDoc(docRef, {
       love: this.animal.love-=1
      });
    }
  }
});

App.mount("#app");
