// components/CreateTodoPopup.js

import { useState } from 'react';

const CreateTodoPopup = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, date });
    setTitle('');
    setDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="closeButton" onClick={onClose}>
          Close
        </button>
        <h2>Create New Todo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTodoPopup;
