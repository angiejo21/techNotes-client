import { useState, useEffect } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

//user,title,text,completed

function NewNoteForm({ users }) {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState(users[0].id);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUser("");
      setTitle("");
      setText("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const canSave = [user, title, text].every(Boolean) && !isLoading;

  const onUserChanged = (e) => setUser(e.target.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) await addNewNote({ user, title, text });
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

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveNoteClicked}>
        <h2>New Note</h2>
        <div className="form__action-buttons">
          <button className="icon-button" title="Save" disabled={!canSave}>
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
        <label htmlFor="title" className="form__label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          autoComplete="off"
          className={`form__input ${!title ? "form__input--incomplete" : ""}`}
          value={title}
          onChange={onTitleChanged}
        />

        <label htmlFor="text" className="form__label">
          Text
        </label>
        <textarea
          name="text"
          id="text"
          className={`form__input ${!text ? "form__input--incomplete" : ""}`}
          value={text}
          onChange={onTextChanged}
        />

        <label htmlFor="user" className="form__label form__checkbox-container">
          User
        </label>
        <select
          name="user"
          id="user"
          className={`form__select ${!user ? "form__input--incomplete" : ""}`}
          value={user}
          onChange={onUserChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
}

export default NewNoteForm;
