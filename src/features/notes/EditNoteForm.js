import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

function EditNoteForm({ note, users }) {
  const { isManager, isAdmin } = useAuth();
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState(
    users.find((user) => user.username === note.user).id
  );
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUser("");
      setTitle("");
      setText("");
      setCompleted(false);
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const canSave = [user, title, text].every(Boolean) && !isLoading;

  const onUserChanged = (e) => setUser(e.target.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = () => setCompleted((prevValue) => !prevValue);

  const onSaveNoteClicked = async (e) => {
    if (canSave)
      await updateNote({ id: note.id, user, title, text, completed });
  };
  const onDeleteNoteClicked = async (e) => {
    if (canSave) await deleteNote({ id: note.id });
  };

  const options = users.map((user) => {
    if (user.active) {
      return (
        <option key={user.id} value={user.id}>
          {user.username}
        </option>
      );
    } else {
      return null;
    }
  });

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const errorContent = (error?.data?.message || delError?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }
  const content = (
    <>
      <p className={errClass}>{errorContent}</p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveNoteClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label htmlFor="note-title" className="form__label">
          Title:
        </label>
        <input
          type="text"
          name="title"
          id="note-title"
          autoComplete="off"
          className={`form__input ${!title ? "form__input--incomplete" : ""}`}
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="note-text" className="form__label">
          Text:
        </label>
        <textarea
          name="text"
          id="note-text"
          className={`form__input ${!text ? "form__input--incomplete" : ""}`}
          value={text}
          onChange={onTextChanged}
        />

        <div className="form__row">
          <div className="form__divider">
            <label
              htmlFor="note-completed"
              className="form__label form__checkbox-container"
            >
              WORK COMPLETED:
            </label>
            <input
              type="checkbox"
              name="completed"
              id="note-completed"
              className="form__checkbox"
              checked={completed}
              onChange={onCompletedChanged}
            />

            <label
              htmlFor="note-username"
              className="form__label form__checkbox-container"
            >
              ASSIGNED TO:
            </label>
            <select
              name="user"
              id="note-username"
              className="form__select"
              value={user}
              onChange={onUserChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
}

export default EditNoteForm;
