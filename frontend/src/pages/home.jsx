import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { get_notes, add_note_for_user, update_note_for_user, delete_note_for_user } from "../utils/http_methods";

const Home = () => {
  const auth = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [editNoteID, setEdit] = useState(null);
 
  const editNoteHandler = (e, note_detail)=>{
    console.log(note_detail);
    setEdit(note_detail.id);
    setActiveItem(note_detail.notes);
  }

  const noteChangeHandler = (e)=>{
     setActiveItem(e.target.value);
  }

  async function updateNoteHandler(){
    var request_dict = {};
    request_dict["notes"] = activeItem;
    request_dict["user"] = auth.userID;
    const resp = await update_note_for_user(auth.authToken.access, request_dict,editNoteID);
    if(resp.status === 201 || resp.status === 200){
       setEdit(null);
       setActiveItem("");
       retrieve_notes_for_user();
    }
    else{
      setError(resp.message || "Something went wrong");
      setActiveItem("");
      setEdit(null);
    }
  }
  async function addNoteHandler(){
    var request_dict = {};
    console.log(auth.user);
    request_dict["notes"] = activeItem;
    request_dict["user"] = auth.userID;
    const resp = await add_note_for_user(auth.authToken.access,request_dict);
    if(resp.status === 201 || resp.status === 200){
       setActiveItem("");
       retrieve_notes_for_user();
    }
    else{
      setError(resp.message || "Something went wrong");
      setActiveItem("");
    }
  }

  async function deleteNoteHandlerUser(noteID){
    const resp = await delete_note_for_user(auth.authToken.access,noteID);
    console.log(resp);
    if(resp.status === 204 || resp.status === 200){
       setActiveItem("");
       setEdit(null);
       retrieve_notes_for_user();
    }
    else{
      setError(resp.message || "Something went wrong");
      setActiveItem("");
      setEdit(null)
    }
  }

  const deleteNoteHandler = (e,noteID) =>{
    deleteNoteHandlerUser(noteID);
  }

  const submitHandler = (e)=>{
    e.preventDefault();

    if(editNoteID){
        updateNoteHandler();
    }
    else{
       addNoteHandler();
    }
  }

  async function retrieve_notes_for_user() {
    try {
      const response = await get_notes(auth.authToken.access);
      if (response.status === 200 || response.status === 201) {
        setError(null);
        console.log(response.data);
        setNotes(response.data);
      } else if (
        response.status === 401 ||
        response.statusText === "Unauthorized"
      ) {
        auth.logoutHandler();
      }
    } catch (err) {
      const errmsg = err.response.detail || "Something went wrong!";
      setError(errmsg);
      auth.logoutHandler();
    }
  } 

  useEffect(() => {
    retrieve_notes_for_user();
  }, []);

  return (
    <>
      <div className="w-75 bg-whiteContainer m-auto">
      <div id="form-wrapper">
        <form id="form" onSubmit={submitHandler}>
          <div className="d-flex">
            <div style={{"flex": "9 1 0%"}}>
              <input
                className="form-control rounded-r-none"
                id="title"
                placeholder="Add Notes.."
                type="text"
                value={activeItem}
                name="title"
                onChange={noteChangeHandler}
              />
            </div>
            <div style={{ flex: "1 1 0%" }}>
              <input
                id="submit"
                className="btn btn-primary"
                type="submit"
                name="Add"
              />
            </div>
          </div>
        </form>
      </div>
        <div
          className={
            error
              ? "alert alert-danger danger-alert danger-alert-animation"
              : "alert alert-danger danger-alert"
          }
          role="alert"
        >
          {error}
        </div>
        <div id="list-wrapper">
        {notes.length > 0 && 
          notes.map((note, ind) => {
            // console.log(ind,note);
            return (<div key={ind} className='note-wrapper flex-wrapper'>
              <div style={{ flex: 17 }}>
                <span>{note.notes}</span>
              </div>

              <div style={{ flex: 1 }}>
                <button className="btn btn-sm btn-outline-info w-100" onClick={(e) => editNoteHandler(e,note)} >Edit</button>
              </div>

              <div style={{ flex: 1 }}>
                <button className="btn btn-sm btn-outline-dark w-75 delete" onClick={(e)=>deleteNoteHandler(e,note.id)}>-</button>
              </div>
            </div>)
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
