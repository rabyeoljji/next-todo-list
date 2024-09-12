// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// firestore에서 모든 할 일 가져오기
export async function fetchTodos() {
  const querySnapshot = await getDocs(collection(db, "todos"));

  if (querySnapshot.empty) {
    return [];
  }

  const fetchedTodos = [];

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // doc.data()가 doc객체

    const aTodo = {
      id: doc.id,
      title: doc.data()["title"],
      is_done: doc.data()["is_done"],
      created_at: doc.data()["created_at"].toDate(),
      // (+) .toLocaleTimeString("ko") 메서드를 이용하면 "오후 01:22:30" 이런식으로 값이 반환되게 할 수 있다.
    };

    fetchedTodos.push(aTodo);
  });

  return fetchedTodos;
}

// 할 일 생성하기
export async function addATodo({ title }) {
  // Add a new document with a generated id
  const newTodoRef = doc(collection(db, "todos"));

  const newTodoData = {
    id: newTodoRef.id,
    title: title,
    is_done: false,
    created_at: new Date(),
  };

  // later...
  await setDoc(newTodoRef, newTodoData);

  return newTodoData;
}

// 단일 할 일 가져오기
export async function fetchATodo(id) {
  if (!id) {
    return null;
  }

  const todoDocRef = doc(db, "todos", id);
  const todoDocSnap = await getDoc(todoDocRef);

  if (todoDocSnap.exists()) {
    console.log("Document data:", todoDocSnap.data()); // todoDocSnap.data()가 해당하는 doc 객체

    const fetchedTodo = {
      id: todoDocSnap.id,
      title: todoDocSnap.data()["title"],
      is_done: todoDocSnap.data()["is_done"],
      created_at: todoDocSnap.data()["created_at"].toDate(),
    };

    return fetchedTodo;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");

    return null;
  }
}

// 단일 할 일 삭제하기
export async function deleteATodo(id) {
  if (!id) {
    return null;
  }

  const fetchedTodo = await fetchATodo(id);

  if (!fetchedTodo) return null;

  await deleteDoc(doc(db, "todos", id));

  return fetchedTodo; // 지워진 할 일 정보 반환
}

// 단일 할 일 수정하기
export async function editATodo(id, { title, is_done }) {
  if (!id) {
    return null;
  }

  const fetchedTodo = await fetchATodo(id);

  if (!fetchedTodo) return null;

  const todoRef = doc(db, "todos", id);

  await updateDoc(todoRef, {
    title: title,
    is_done: is_done,
  });

  const updatedTodo = {
    ...fetchedTodo,
    title: title,
    is_done: is_done,
  };

  return updatedTodo;
}
