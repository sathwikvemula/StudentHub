import { useState } from "react";
import API from "./Api";

function NoteForm({ onNoteCreated }) {

const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [category, setCategory] = useState("");
const [priority, setPriority] = useState("LOW");
const [deadline, setDeadline] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();


try {

  const note = {
    title,
    content,
    category,
    priority,
    deadline: deadline
      ? deadline + ":00"
      : null,
    completed: false
  };

  const response = await API.post(
    "/api/v1/notes",
    note
  );

  console.log("Created note:", response.data);

  alert("Note created successfully!");

  // Tell Dashboard to reload notes
  onNoteCreated();

  // Clear form
  setTitle("");
  setContent("");
  setCategory("");
  setPriority("LOW");
  setDeadline("");

} catch (error) {

  console.error("Create note error:", error);

  alert(
    error.response?.data?.message ||
    "Failed to create note"
  );
}


};

return ( <div>


  <h2>Create Note</h2>

  <form onSubmit={handleSubmit}>

    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />

    <br /><br />

    <textarea
      placeholder="Content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows="5"
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="Category (DSA, Java, DBMS...)"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    <br /><br />

    <label>
      Priority:
    </label>

    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
    >
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>

    <br /><br />

    <label>
      Deadline:
    </label>

    <br />

    <input
      type="datetime-local"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
    />

    <br /><br />

    <button type="submit">
      Create Note
    </button>

  </form>

</div>


);
}

export default NoteForm;
