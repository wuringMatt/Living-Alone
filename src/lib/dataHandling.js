import firebaseConfig from "$lib/firebaseConfig.js"
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export function getAuthentication(){
    const auth = getAuth(app)
    return { auth }
}

/*
    GetData function
    parameters:
        path:
            path to collection or document
            make sure NOT to end the path parameter with "/"

    getting collection path example:
        "users/{userid}/chores"
        returns array in promise
        gets all the chores documents for the logged in user

    getting document path example:
        "users/{userid}"
        returns object in promise
        gets all the fields for the currently logged in user

    it replaces {userid} with currently loggedin user's id autmatically

    getting data exmaple:
        getData("users/{userid}")
        .then((res) => {
            console.log(res)
            res = obj if document, array if collection
        }).catch( err => console.log(err) )
*/

/**
 * returns object if path leads to document
 * returns array if path leads to collection
 * @param {string} path
 */
export function getData(path) {
    const pathArray = path.split("/")
    return new Promise((resolve, reject) => {
        if(pathArray[pathArray.length - 1] == ""){reject("getData path can't end in '/'"); return}
        onAuthStateChanged(auth, (user) => {
            if(user){
                if (pathArray.length > 1){path = path.replace("{userid}", user.uid)}
                if (pathArray.length % 2 == 0){
                    getDoc(doc(db, path))
                        .then((querySnapshot) => {
                            resolve(querySnapshot.data())
                        }).catch(err => reject(err))
                } else {
                    getDocs(collection(db, path))
                        .then((querySnapshot) => {
                            const queryList = querySnapshot.docs.map(doc => doc.data())
                            resolve(queryList)
                        }).catch(err => reject(err))
                }
            } else {
                reject("no user logged in")
            }
        })
    })
}



/*
    setData function
    use this if the document doesn't exist yet

    parameters:
        path:
            path to document
        obj:
            object that gets written to path document

    setting data example:
        setData("users/{userid}/chores/laundry", {name: "laundry", frequency: "once a week"})
        .then((res) => {
            do whatever you want after setting the data here
            res = "data added"
        })
        .catch((err) => console.log(err))

    to edit arrays:
        obj parameter:
        You will have to add / import { arrayUnion arrayRemove } from "firebase/firestore" / at the top of your page
            {
                Emergency Contacts: arrayUnion(anything that you want to add to the array here)
                Emergency Contacts: arrayRemove(anything that you want to remove from the array here)
            }
*/

/**
 * sets data to a document
 * @param {string} path
 * @param {object} obj
 */
export function setData(path, obj) {
    const pathArray = path.split("/")
    return new Promise((resolve, reject) => {
        if(pathArray[pathArray.length - 1] == ""){reject("setData path can't end in '/'"); return}
        onAuthStateChanged(auth, (user) => {
            if(user){
                if (pathArray.length > 1){path = path.replace("{userid}", user.uid)}
                if (pathArray.length % 2 == 1){
                    reject("setData can't write data to collection")
                } else {
                    setDoc(doc(db, path), obj, {merge: true})
                        .then(() => {
                            resolve("data added")
                        }).catch(err => reject(err))

                }
            } else {
                reject("no user logged in")
            }
        })
    })
}


/*
    Delete data function
    deletes a document from the database

    parameters:
        path:
            path to the document that you want to delete
*/

/**
 * deletes document at given path
 * @param {string} path
 */
export function deleteData(path){
    const pathArray = path.split("/")
    return new Promise((resolve, reject) => {
        if(pathArray[pathArray.length - 1] == ""){reject("deleteData path can't end in '/'"); return}
        onAuthStateChanged(auth, (user) => {
            if(user){
                if(pathArray.length > 1){path = path.replace("{userid}", user.uid)}
                if(pathArray.length % 2 == 1){
                    reject("deleteData can't delete collections")
                } else {
                    deleteDoc(doc(db, path))
                    resolve("Data deleted")
                }
            } else {
                reject("no user logged in")
            }
        })
    })
}