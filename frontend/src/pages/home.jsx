import React, { useContext, useEffect, useState, useCallback } from "react";

import AuthContext from "../context/AuthContext";
import {
  get_notes,
  add_note_for_user,
  update_note_for_user,
  delete_note_for_user,
} from "../utils/http_methods";

const Home = () => {
  const auth = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [editNoteID, setEdit] = useState(null);

  /* ---------------- FETCH NOTES ---------------- */
  const retrieveNotesForUser = useCallback(async () => {
    try {
      const response = await get_notes(auth.authToken.access);

      if (response.status === 200 || response.status === 201) {
        setError(null);
        setNotes(response.data);
      } else if (response.status === 401) {
        auth.logoutHandler();
      }
    } catch (err) {
      setError("Something went wrong!");
      auth.logoutHandler();
    }
  }, [auth]);

  /* ---------------- NOTE HANDLERS ---------------- */
  const editNoteHandler = (note) => {
    setEdit(note.id);
    setActiveItem(note.notes);
  };

  const noteChangeHandler = (e) => {
    setActiveItem(e.target.value);
  };

  const updateNoteHandler = async () => {
    const requestData = {
      notes: activeItem,
      user: auth.userID,
    };

    const resp = await update_note_for_user(
      auth.authToken.access,
      requestData,
      editNoteID
    );

    if (resp.status === 200 || resp.status === 201) {
      setEdit(null);
      setActiveItem("");
      retrieveNotesForUser();
    } else {
      setError(resp.message || "Something went wrong");
    }
  };

  const addNoteHandler = async () => {
    const requestData = {
      notes: activeItem,
      user: auth.userID,
    };

    const resp = await add_note_for_user(auth.authToken.access, requestData);

    if (resp.status === 200 || resp.status === 201) {
      setActiveItem("");
      retrieveNotesForUser();
    } else {
      setError(resp.message || "Something went wrong");
    }
  };

  const deleteNoteHandler = async (noteID) => {
    const resp = await delete_note_for_user(auth.authToken.access, noteID);

    if (resp.status === 200 || resp.status === 204) {
      setEdit(null);
      setActiveItem("");
      retrieveNotesForUser();
    } else {
      setError(resp.message || "Something went wrong");
    }
  };

  /* ---------------- FORM SUBMIT ---------------- */
  const submitHandler = (e) => {
    e.preventDefault();

    if (editNoteID) {
      updateNoteHandler();
    } else {
      addNoteHandler();
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    retrieveNotesForUser();
  }, [retrieveNotesForUser]);

  return (
    <div className="w-75 bg-whiteContainer m-auto">
      <div id="form-wrapper">
        <form id="form" onSubmit={submitHandler}>
          <div className="d-flex">
            <div style={{ flex: "9 1 0%" }}>
              <input
                className="form-control rounded-r-none"
                placeholder="Add Notes.."
                type="text"
                value={activeItem}
                onChange={noteChangeHandler}
              />
            </div>
            <div style={{ flex: "1 1 0%" }}>
              <input className="btn btn-primary" type="submit" value="Add" />
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div id="list-wrapper">
        {notes.map((note) => (
          <div key={note.id} className="note-wrapper flex-wrapper">
            <div style={{ flex: 17 }}>
              <span>{note.notes}</span>
            </div>

            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-info w-100"
                onClick={() => editNoteHandler(note)}
              >
                Edit
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <button
                className="btn btn-sm btn-outline-dark w-75 delete"
                onClick={() => deleteNoteHandler(note.id)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
