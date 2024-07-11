const apiUrl = 'https://crudcrud.com/api/70137e11c051465b90d0dbc8806fbbce/notes';

window.onload = fetchNotes;

async function fetchNotes() {
    try {
        const response = await fetch(apiUrl);
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function addNote() {
    const title = document.getElementById('noteTitle').value;
    const desc = document.getElementById('noteDesc').value;

    if (title && desc) {
        const note = { title, desc };

        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(note),
            });

            document.getElementById('noteTitle').value = '';
            document.getElementById('noteDesc').value = '';
            fetchNotes();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    } else {
        alert('Please fill in both fields');
    }
}

async function deleteNote(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
        fetchNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

async function editNote(id) {
    const newTitle = prompt('Enter new title');
    const newDesc = prompt('Enter new description');

    if (newTitle && newDesc) {
        const updatedNote = { title: newTitle, desc: newDesc };

        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNote),
            });
            fetchNotes();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    } else {
        alert('Please fill in both fields');
    }
}

function searchNotes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note-item');
    let showingCount = 0;

    notes.forEach(note => {
        const title = note.querySelector('.note-title').innerText.toLowerCase();
        const desc = note.querySelector('.note-desc').innerText.toLowerCase();

        if (title.includes(query) || desc.includes(query)) {
            note.style.display = 'block';
            showingCount++;
        } else {
            note.style.display = 'none';
        }
    });

    document.getElementById('showingNotes').innerText = showingCount;
}

function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';

        const noteTitle = document.createElement('p');
        noteTitle.className = 'note-title';
        noteTitle.innerText = note.title;

        const noteDesc = document.createElement('p');
        noteDesc.className = 'note-desc';
        noteDesc.innerText = note.desc;

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = () => editNote(note._id);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteNote(note._id);

        noteItem.appendChild(noteTitle);
        noteItem.appendChild(noteDesc);
        noteItem.appendChild(editButton);
        noteItem.appendChild(deleteButton);

        notesList.appendChild(noteItem);
    });

    document.getElementById('totalNotes').innerText = notes.length;
    document.getElementById('showingNotes').innerText = notes.length;
}
