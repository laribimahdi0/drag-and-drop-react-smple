import React from "react";

export default function DropZone(props) {
  return (
    <div
      onDragOver={e => props.onDragOver(e)}
      onDrop={e => props.onDrop(e)}
      className="todos "
      id={props.name}
    >
      <h1> {props.name}</h1>
      {props.list.map((item, index) => (
        <div
          className="ui card task shadow "
          name={props.name}
          draggable
          onDrag={e => props.onDrag(e, item)}
          id={item.status}
          key={index}
        >
          <div className="content">
            <div className="header"> {item.title}</div>
            <div className="meta">id : {item.id}</div>
            <div className="description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
