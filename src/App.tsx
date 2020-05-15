import React, { useEffect, useState } from 'react';
import firebase from './firebase.js';

function App() {

  const [taskList, setTaskList] = useState<any[]>([]);
  const [task, setTask] = useState<string>('');
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string>('');

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

  const editTask = async (e: any) => {

    e.preventDefault()

    if(!task.trim()){
      return
    }
    try {
      const db = firebase.firestore()
      await db.collection('tareas').doc(taskId).update({
        nombre: task
      })
      const arrayEditado = taskList.map(item => (
        item.id === taskId ? {id: item.id, fecha: item.fecha, nombre: task} : item
      ))
      setTaskList(arrayEditado)
      setEditionMode(false)
      setTaskId('')
      setTask('')
    } catch (error) {
      console.log(error)
    }
}

  const activeEditionMode = async (item: any) => {
    setEditionMode(true)
    setTask(item.nombre)
    setTaskId(item.id)
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
                    Delete
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick={() => activeEditionMode(item)}
                  >
                    Edit
                  </button>

                </li>
              )) : null
            }
          </div>
        </div>
        <div className="col-6">
            <h2 className="text-center mb-3">
            {
              editionMode ? 'Edit Task' : 'Add Task'
            }
            </h2>
            <form onSubmit={ editionMode ? editTask : addTask }>
            <input
                type="text"
                placeholder="Write your Task"
                className="form-control mb-2"
                value={ task }
                onChange={e => setTask(e.target.value)}
            />
            <button
              type='submit'
              className= {
                editionMode ? 'btn btn-warning btn-block btn-sm' :
                'btn btn-dark btn-block btn-sm'
              }
            >
              {
                editionMode ? 'Edit' : 'Add'
              }
            </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default App;
