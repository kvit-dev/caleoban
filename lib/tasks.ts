import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, Timestamp, orderBy, Unsubscribe, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  date: string;
  dueDate?: string; 
  userId: string;
  dependsOn?: string[];
  createdAt: Timestamp;
  endDateTime?: string; 
}

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  } 
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
  } catch (e) {
    console.error('Помилка оновлення завдання: ', e);
    throw e;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (e) {
    console.error('Помилка видалення завдання: ', e);
    throw e;
  }
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void): Unsubscribe => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    callback(tasks);
  });
};