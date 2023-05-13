import React, { useState, useEffect } from 'react';
import './App.css';
import Preview from './components/preview';
import Message from './components/message';
import NotesContainer from './components/notes/notesContainer';
import NotesList from './components/notes/notesList';
import Note from './components/notes/not';
import NoteForm from './components/notes/noteForm';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
      } else {
        localStorage.setItem('notes', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error parsing notes from localStorage:', error);
      // يمكنك اتخاذ إجراء مناسب في حالة حدوث خطأ في تحويل البيانات
      console.error(storedNotes);
    }
  }, []);

  const changeTitleHandler = event => {
    setTitle(event.target.value);
  };

  const changeContentHandler = event => {
    setContent(event.target.value);
  };

  const saveNoteHandler = () => {
    const note = {
      id: new Date(),
      title: title,
      content: content,
    };

    const updatedNotes = [...notes, note];

    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  };

  const selectNoteHandler = noteId => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  };

  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  const updatedNoteHandler = () => {
    const updatedNot = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updatedNot[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content,
    };

    setNotes(updatedNot);
    setEditing(false);
    setTitle('');
    setContent('');
  };

  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  };

  const deleteNoteHandler = () => {
    const updatedNots = [...notes];
    const notIndex = updatedNots.findIndex(note => note.id === selectedNote);
    notes.splice(notIndex, 1);
    setNotes(notes);
    setSelectedNote(null);
  };

  const getAddNote = () => {
    return (
      <NoteForm
        formTitle='ملاحظة جديدة'
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText='حفظ'
        submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title='لا توجد ملاحظة' />;
    }

    if (!selectedNote) {
      return <Message title='الرجاء اختيار ملاحظة' />;
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle='تعديل ملاحظة'
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText='تعديل'
          submitClicked={updatedNoteHandler}
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className='note-operations'>
            <a href='#' onClick={editNoteHandler}>
              <i className='fa fa-pencil-alt' />
            </a>
            <a href='#' onClick={deleteNoteHandler}>
              <i className='fa fa-trash' />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className='App'>
      <NotesContainer>
        <NotesList>
          {notes.map(note => (
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectNoteHandler(note.id)}
              active={selectedNote === note.id}
            />
          ))}
        </NotesList>
        <button className='add-btn' onClick={addNoteHandler}>
          +
        </button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
    </div>
  );
}

export default App;
