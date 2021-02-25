//const functions = require("firebase-functions");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//exports.helloWorld = functions.https.onRequest((request, response) => {
  //functions.logger.info("Hello logs!", {structuredData: true});
 // response.send("Hello from Firebase!");
 //});

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
//default reference
const admin = require('firebase-admin');
// The Firebase Admin SDK to access Firestore.
admin.initializeApp();
const db = admin.firestore();

// The Cloud Functions
exports.verifyUnusedCode = functions.https.onCall((data, context) =>{
  const userRef = db.collection('users');
  const idCodeRef = db.collection("codes").doc('codelist');
  return idCodeRef.get().then((doc)=>{
    const codes = doc.data()['codes'];
    if (codes.indexOf(data.code) != -1){
      return userRef.where('code', '==', data.code)
      .get()
      .then((snapshot)=>{
        if (snapshot.empty){
          return true
        }
        return false;
      })
      .catch((error)=>{
        return error;
      });
    }
    else{
      return false;
    }
  });
});

exports.usernameExists = functions.https.onCall((data, context) =>{
  return db.collection('users').where("username", "==", data.username)
          .get()
          .then((snapshot) =>{
              if (snapshot.empty){
                return false;
              }else{
                return true;
              }
          });
});

exports.sendToken = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  const token = data.token;
  return db.collection('tokens').doc(uid).set({token: token});
});

// Auto function on creation
exports.userSignUp = functions.auth.user().onCreate((user)=>{
  return db.collection('users').doc('default').get().then(
    (doc) => {
      var achievements = doc.data().badges;
      db.collection('users').doc(user.uid).set({
        email: user.email,
        badges: achievements,
      }, { merge: true });
    });
});

exports.userCreateModuleDoc = functions.auth.user().onCreate((user)=>{
  return db.collection('modules').doc('default').get().then(
    (doc) => {
      admin.firestore().collection('modules').doc(user.uid).create(doc.data());
  })
});

// Auto functions on deletion.
exports.userDeleted = functions.auth.user().onDelete((user)=>{
  const doc = db.collection('users').doc(user.uid);
  return doc.delete();
});

exports.userDeleteModulesDoc = functions.auth.user().onDelete((user)=>{
  const doc = db.collection('modules').doc(user.uid);
  return doc.delete();
});
