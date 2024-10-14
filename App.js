import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [subtaskValue, setSubtaskValue] = useState("");
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { name: inputValue, date: new Date().toLocaleString() ,subtasks: [] }]);
      setInputValue(""); // Clear input after adding
    }
  };

  const addSubtask = (index) => {
    if (subtaskValue.trim()) {
      const newTasks = [...tasks];
      newTasks[index].subtasks.push(subtaskValue);
      setTasks(newTasks);
      setSubtaskValue(""); // Clear subtask input after adding
      setActiveTaskIndex(null);
    }
  };

  const removeSubtask = (taskIndex, subIndex) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].subtasks.splice(subIndex, 1); // Remove the subtask
    setTasks(newTasks); // Update the tasks state
  };

  const removeTask = (taskIndex) => {
    const newTasks = tasks.filter((_, index) => index !== taskIndex); // Remove the task from the list
    setTasks(newTasks);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const newTasks = [...tasks];
    const [movedSubtask] = newTasks[source.droppableId].subtasks.splice(
      source.index,
      1
    );
    newTasks[destination.droppableId].subtasks.splice(
      destination.index,
      0,
      movedSubtask
    );
    setTasks(newTasks);
  };

  return (
    <div className="text-center p-5">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Todo List !</h1>
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          className="border border-blue-500 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          className="bg-blue-500 text-white rounded-lg px-4 py-2 transition duration-200 hover:bg-blue-600"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row items-center space-x-4 mb-6">
          {tasks.length > 0 ? (
            tasks.map((task, taskIndex) => (
              <div
                key={taskIndex}
                className="border border-blue-300 rounded-lg p-4 w-72 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="font-bold text-xl text-blue-500">{task.name}</h2>
                <p className="text-gray-500 text-sm">{task.date}</p> {/* Display date and time */}

                {activeTaskIndex === taskIndex ? (
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      className="border border-blue-300 rounded-lg px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                      value={subtaskValue}
                      onChange={(e) => setSubtaskValue(e.target.value)}
                      placeholder="Add a subtask"
                    />

                    <button
                      className="bg-blue-500 text-white rounded-lg px-2 py-1 ml-2 transition duration-200 hover:bg-blue-600"
                      onClick={() => addSubtask(taskIndex)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mb-2">
                    <button
                      className="bg-blue-500 text-white rounded-lg px-2 py-1 ml-2 transition duration-200 hover:bg-blue-600"
                      onClick={() => setActiveTaskIndex(taskIndex)}
                    >
                      Add Subtask
                    </button>

                    <button
                      className="bg-red-500 text-white rounded-lg px-2 py-1 ml-2 transition duration-200 hover:bg-red-600"
                      onClick={() => removeTask(taskIndex)}
                    >
                      Remove Task
                    </button>
                  </div>
                )}

                <Droppable droppableId={taskIndex.toString()}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {task.subtasks.length > 0 ? (
                        task.subtasks.map((subtask, subIndex) => (
                          <Draggable
                            key={`${taskIndex}-${subIndex}`}
                            draggableId={`${taskIndex}-${subIndex}`}
                            index={subIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border border-gray-300 rounded-lg p-2 mt-1 ml-4 bg-gray-100 shadow-sm"
                              >
                                <span className="text-gray-700">
                                  - {subtask}
                                </span>
                                <button
                                  className="bg-red-500 text-white rounded-lg px-2 py-1 ml-2 transition duration-200 hover:bg-red-400"
                                  onClick={() =>
                                    removeSubtask(taskIndex, subIndex)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-gray-500">No subtasks yet!</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks yet!</p>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
