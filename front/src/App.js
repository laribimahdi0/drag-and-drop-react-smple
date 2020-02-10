import React, { Component } from "react";
import DropZone from "./components/DropZone";
import { Button, Modal, Form } from "semantic-ui-react";
import "./App.css";
import Axios from "axios";
class App extends Component {
  state = {
    title: "",
    description: "",
    from: "",
    story: [],

    notStarted: [],
    inProgress: [],

    done: [],
    draggedTask: {},
    errors: {}
  };

  componentDidMount = () => {
    const story = [];
    const notStarted = [];
    const inProgress = [];
    const done = [];

    Axios.get("http://localhost:4000/api/tasks").then(response => {
      response.data.forEach(task => {
        console.log(task.status);

        switch (task.status) {
          case "story":
            story.push(task);
            break;
          case "notStarted":
            notStarted.push(task);
            break;

          case "inProgress":
            inProgress.push(task);
            break;
          case "done":
            done.push(task);
            break;

          default:
            return;
        }
      });
      this.setState({
        story,
        notStarted,
        inProgress,
        done
      });
    });
  };

  onDrag = (event, task) => {
    event.preventDefault();
    this.setState({
      draggedTask: task
    });
  };
  onDragOver = event => {
    event.preventDefault();
  };
  onDrop = event => {
    const { draggedTask } = this.state;
    let taskHandler = this.state.draggedTask;
    let newList = [];

    switch (event.currentTarget.id) {
      case "story":
        if (taskHandler.status === "story") {
          return;
        }
        newList = this.state[taskHandler.status].filter(
          task => task.id !== taskHandler.id
        );
        //  taskHandler.status = "story";
        this.setState(
          {
            [taskHandler.status]: newList,
            story: [...this.state.story, { ...taskHandler, status: "story" }]
          },
          () => this.updateTask(draggedTask.id, "story")
        );

        break;
      case "notStarted":
        if (taskHandler.status === "notStarted") {
          console.log(false);
          return;
        }
        newList = this.state[taskHandler.status].filter(
          task => task.id !== taskHandler.id
        );
        console.log(taskHandler);
        this.setState(
          {
            [taskHandler.status]: newList,
            notStarted: [
              ...this.state.notStarted,
              { ...taskHandler, status: "notStarted" }
            ]
          },
          () => this.updateTask(draggedTask.id, "notStarted")
        );
        break;

      case "inProgress":
        if (taskHandler.status === "inProgress") {
          console.log(false);
          return;
        }
        newList = this.state[taskHandler.status].filter(
          task => task.id !== taskHandler.id
        );
        console.log(taskHandler);
        this.setState(
          {
            [taskHandler.status]: newList,
            inProgress: [
              ...this.state.inProgress,
              { ...taskHandler, status: "inProgress" }
            ]
          },
          () => this.updateTask(draggedTask.id, "inProgress")
        );
        break;
      case "done":
        if (taskHandler.status === "done") {
          console.log(false);
          return;
        }
        newList = this.state[taskHandler.status].filter(
          task => task.id !== taskHandler.id
        );
        console.log(taskHandler);
        this.setState(
          {
            [taskHandler.status]: newList,
            done: [...this.state.done, { ...taskHandler, status: "done" }]
          },
          () => this.updateTask(draggedTask.id, "done")
        );
        break;

      default:
        return;
    }
  };

  handlechange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  formValidation = () => {
    const { title, description } = this.state;
    let error = {};
    if (title.length < 1) {
      error.title = {
        content: "please add title",
        pointing: "below"
      };
    }

    if (description.length < 1) {
      error.description = {
        content: "please add description",
        pointing: "below"
      };
    }

    for (let [key, value] of Object.entries(error)) {
      if (key && value) {
        this.setState({
          errors: error
        });
        return false;
      }
    }
    this.setState({
      errors: error
    });
    return true;
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, description } = this.state;

    if (this.formValidation()) {
      console.log("api call");
      Axios.post("http://localhost:4000/api/tasks", {
        title,
        description
      }).then(response => {
        this.setState({
          story: [...this.state.story, response.data]
        });
      });
    }
  };

  updateTask = (id, status) => {
    Axios.patch(`http://localhost:4000/api/tasks/${id}`, {
      status
    })
      .then(response => console.log("updated sucess"))
      .catch(err => console.log(err));
  };
  // if (this.state.title.length < 1) {
  //   this.setState({
  //     errors: {
  //       content: "please add title",
  //       pointing: "below"
  //     }
  //   });

  render() {
    const { errors, title, description } = this.state;
    return (
      <>
        <Modal size="tiny" trigger={<Button primary>Add story</Button>}>
          <Modal.Header>Add new story</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                label="Title"
                placeholder="title"
                name="title"
                error={errors.title}
                value={title}
                onChange={this.handlechange}
              />
              <Form.TextArea
                name={"description"}
                onChange={this.handlechange}
                label="Description"
                placeholder="describe your task here"
                value={description}
                error={errors.description}
              />

              <Form.Field></Form.Field>
              <Button type="submit">Submit</Button>
            </Form>
          </Modal.Content>
        </Modal>
        <div className="task-container">
          <DropZone
            onDrag={(e, task) => this.onDrag(e, task)}
            onDragOver={e => this.onDragOver(e)}
            onDrop={event => this.onDrop(event)}
            name={"story"}
            list={this.state.story}
          />
          <DropZone
            onDragOver={e => this.onDragOver(e)}
            onDrop={event => this.onDrop(event)}
            name={"notStarted"}
            list={this.state.notStarted}
            onDrag={(e, task) => this.onDrag(e, task)}
          />
          <DropZone
            onDragOver={e => this.onDragOver(e)}
            onDrop={event => this.onDrop(event)}
            name={"inProgress"}
            list={this.state.inProgress}
            onDrag={(e, task) => this.onDrag(e, task)}
          />
          <DropZone
            onDragOver={e => this.onDragOver(e)}
            onDrop={e => this.onDrop(e)}
            name={"done"}
            list={this.state.done}
            onDrag={(e, task) => this.onDrag(e, task)}
          />
        </div>
      </>
    );
  }
}

export default App;
