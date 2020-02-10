import Axios from "axios";

export const setTask = async task => {
  try {
    const response = await fetch(`http://localhost:4000/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw response;
    }

    return response;
  } catch (err) {
    throw err;
  }
};
export const getTask = async () => {
  try {
    const response = await fetch(`http://localhost:4000/api/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response;
  } catch (err) {
    throw err;
  }
};
