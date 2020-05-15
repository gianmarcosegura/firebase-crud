import React, { useEffect, useState } from 'react';
import firebase from './firebase.js';

function App() {

  const [taskList, setTaskList] = useState<any[]>([]);
  const [task, setTask] = useState('');

  useEffect(() => {

    const getData = async () => {

      try{
        const db = firebase.firestore();
        const data = await db.collection('tareas').get();
        const datosFinales = data.docs.map((el) => ({
          id: el.id,
          ...el.data()
        }))

        setTaskList(datosFinales);

      } catch (error) {
        console.log(error);
      }
    };

    getData();

  }, [])

  const addTask = async (event: any) => {
    event.preventDefault();

    if(!task.trim()) {
      return
    }

    try{
      const db = firebase.firestore();
      const newTask = {
        nombre: task,
        fecha: Date.now()
      }
      const data = await db.collection('tareas').add(newTask);

      setTaskList([
        ...taskList,
        {
          ...newTask,
          id: data.id
        }
      ]);
      setTask('');

    } catch (error) {
      console.log(error);
    }

    console.log('Sended');

  }

  const deleteTask = async (id: string) => {

    try {
      const db =  firebase.firestore();
      await db.collection('tareas').doc(id).delete();

      setTaskList(
        taskList.filter((item) => item.id !== id)
      )

    } catch (error) {

    }

  }

  const editTask = async (item: any) => {

  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <h2 className="text-center mb-3">Tasks</h2>
          <div className="list-group">
            {
              taskList && taskList.length ? taskList.map((item) => (
                <li className="list-group-item" key={ item.id }>
                  { item.nombre }
                  <button
                    className="btn btn-danger btn-sm float-right"
                    onClick={() => deleteTask(item.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick={() => editTask(item)}
                  >
                    Editar
                  </button>

                </li>
              )) : null
            }
          </div>
        </div>
        <div className="col-6">
        <h2 className="text-center mb-3">Form</h2>
        <form onSubmit={ (event) => addTask(event) }>
          <input
            type="text"
            placeholder="Write your Task"
            className="form-control mb-2"
            onChange={ (e) => setTask(e.target.value) }
            value={ task }/>
            <button
              className="btn btn-dark btn-block"
              type="submit"
            >
              Add
            </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default App;
