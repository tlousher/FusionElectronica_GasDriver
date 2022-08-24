import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }
    insertarAdministradores(coleccion, child, datos) {
    return this.angularFirestore.collection(coleccion).doc(child).set(datos);
  }
    insertarAdministradoresUpdate(coleccion, child, datos) {
    return this.angularFirestore.collection(coleccion).doc(child).update(datos);
  }
  insertarControl(coleccion, child, datos) {
    return this.angularFirestore.collection(coleccion).doc(child).set(datos);
  }
  public updateProfile(email, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore.collection('drivers').doc(email).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }
  consultarUsuarios(coleccion, email) {
    return this.angularFirestore.collection(coleccion).doc(email).get();
  }
  consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }
  consultarData(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).
    doc(documentId).get();
  }
  consultarDatos(coleccion) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }
  deleteData(coleccion, child) {
    return this.angularFirestore.collection(coleccion).doc(child).delete();
  }
}
