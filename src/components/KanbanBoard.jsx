import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import uuid from "uuid/dist/v4";
import styled from "styled-components";
import {itemsFromBackendArray} from "../data/Items";

//console.log(new Date());

const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const {source, destination} = result;
    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]: {
                ...destColumn,
                items: destItems
            }
        })
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]: {
                ...column,
                items: copiedItems
            }
        })
    }
};

function KanbanBoard() {

    const initialState = JSON.parse(localStorage
        .getItem("items")) || [];
    //console.log(initialState);
    const [items, setItems] = useState(initialState);
    //console.log(items)
    let columnsFromBackend =
        {
            [uuid()]: {
                name: "Buyurtma",
                items: items
            },
            [uuid()]: {
                name: "Tayyorlanmoqda",
                items: []
            }, [uuid()]: {
                name: "Tayyor",
                items: []
            },
            [uuid()]: {
                name: "Yetkazilmoqda",
                items: []
            }, [uuid()]: {
                name: "Yetkazildi",
                items: []
            }
        };
    const [columns, setColumns] = useState(columnsFromBackend);
    console.log(columnsFromBackend);
    const [findItem, setFindItem] = useState(null);

    useEffect(() => {
        localStorage.setItem("items", JSON.stringify(items))
    }, [items]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (event) => {
        //event.preventDefault();
        if (!title || !content) {
            return;
        }
        setTitle("");
        setContent("");
        console.log(items);
    };


    const handleChange = (event) => {
        setTitle(event.target.value);

    };
    const handleChangeContent = (event) => {
        setContent(event.target.value);

    };
    const handleAddTask = (title, content) => {
        setItems([...items,
            {id: uuid(), title: title, content: content}
        ])
    };
    const removeTask = (id) => {
        //console.log(id)
        setItems(items.filter(item => item.id !== id));
    };
    const openModal = (id) => {
        //console.log("open modal", id);
        const findItem = initialState.find(item => item.id === id);
        console.log(findItem)
        setFindItem(findItem);
        // console.log(findItem);
    };

    const removeFindItem = () => {
        setFindItem(null);
    };

    return (
        <div>
            <div className="container">
                <ModalWrapper className="">
                    {findItem && (
                        <div className="item-modal shadow-lg">
                            <div className="item-title">
                                Buyurtma: {findItem.title}
                            </div>
                            <div className="item-content">
                                Ma'lumot: {findItem.content}
                            </div>
                            <div className="item-footer">
                                <form>
                                    <button type="submit" onClick={() => removeTask(findItem.id)}
                                            className="btn btn-outline-danger"
                                    >Otmen
                                    </button>
                                    <button onClick={removeFindItem}
                                            className="btn btn-outline-success"
                                    >Yopish
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </ModalWrapper>
                <FormWrapper>
                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={handleChange}
                            className="form-control"
                            value={title}
                            placeholder="Buyurtma nomi"
                            type="text"/>
                        <input
                            onChange={handleChangeContent}
                            className="form-control"
                            placeholder="Buyurtma haqida ma'lumot"
                            value={content}/>
                        <button onClick={() => handleAddTask(title, content)} type="submit"
                                className="btn btn-success">
                            Buyurtma Berish
                        </button>
                    </form>
                </FormWrapper>
            </div>
            <KanbanWrapper>
                <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                    {Object.entries(columns).map(([id, column]) => {
                            return (
                                <div className="board-col" key={id}>
                                    <h5 className="mt-3">{column.name}{" "}({column.items.length})</h5>
                                    <Droppable droppableId={id} key={id}>
                                        {(provided, snapshot) => (
                                            <div className="drag-item"
                                                 {...provided.droppableProps}
                                                 ref={provided.innerRef}
                                                 style={{
                                                     background: snapshot.isDraggingOver ? "lightblue" : "lightgray",
                                                 }}
                                            >
                                                {column.items.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div className="drop-item"
                                                                 onClick={() => openModal(item.id)}
                                                                 ref={provided.innerRef}
                                                                 {...provided.draggableProps}
                                                                 {...provided.dragHandleProps}
                                                                 style={{
                                                                     background: snapshot.isDragging ? "#194e33" : "#27784e",
                                                                     ...provided.draggableProps.style
                                                                 }}
                                                            >
                                                                <div>
                                                                    {item.title}
                                                                </div>
                                                                {/*<div>*/}
                                                                {/*    {item.content}*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        }
                    )}
                </DragDropContext>
            </KanbanWrapper>
        </div>
    );
}

export default React.memo(KanbanBoard);

const FormWrapper = styled.div`
  border-radius: 5px;
  background: lavender;
  form{
    display:flex;
    align-items: center;
    input{
        width: 40%;
        margin: 1rem;
        border-radius: 0;
    }
    button{
      background:#27784e;
      height: 3rem;
      border-radius: 0;
    }
  }
`;


const ModalWrapper = styled.div`
  .item-modal{
    position:absolute;
    display:flex;
    flex-direction: column;
    justify-content:space-between;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    //padding: 2rem;
    height: 15rem;
    width: 30rem;
    background: lightgray;
    border-radius: 5px;
    .item-title{
      background:lavender;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight:bold;
    }
    .item-content{
      padding: 1rem;
    }
    .item-footer{
      background:lavender;
    }
    button{
      margin: 1rem;
      //position:absolute;
      bottom: 0;
    }
  }
`;

const KanbanWrapper = styled.div`
  display:flex;
  justify-content:center;
  height: 80vh;
  
  .board-col{
    display: flex;
    flex-direction: column;
    align-items: center;
    div{
      margin: 0.5rem;
    }
  }
  .drag-item{
    //padding: 0.5rem;
    width: 250px;
    min-height: 500px;  
  }
  .drop-item{
    user-select: none;
    padding: 0.5rem;
    margin: 0 0 8px 0;
    min-height: 3rem;
    color: #fff;
  }
  .container{
    position:relative;
  }
`;