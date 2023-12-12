const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api//PartyPlanner`;
document.addEventListener('DOMContentLoaded', () => {
    const partyList = document.getElementById('partyList');
    const partyForm = document.getElementById('partyForm');

    // Fetch and render parties when the page loads
    async function render() {
        await renderParties();
    }
    render();

    // Event listener for the party form submission
    partyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addParty();
    });

    // Event delegation for delete buttons
    partyList.addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteButton')) {
            const partyId = event.target.dataset.partyId;
            deleteParty(partyId);
        }
    });

    async function renderParties() {
        try {
            // Fetch parties from the API
            const parties = await fetchParties();

            // Clear the existing party list
            partyList.innerHTML = '';

            // Render each party
            parties.forEach((party) => {
                renderParty(party);
            });
        } catch (error) {
            console.error('Error rendering parties:', error);
        }

    }

    async function fetchParties() {
        try {
            const response = await fetch('/api/parties'); // Fix: Changed POST to fetch
            const parties = await response.json();
            return parties;
        } catch (error) {
            console.error('Error fetching parties:', error);
        }
    }

    async function addParty() {
        try {
            const response = await fetch('/api/parties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newParty),
            });
            if (!response.ok) {
                throw new Error('Failed to add party');
            }
            // After adding, call renderParties() to update the list
            renderParties();
        } catch (error) {
            console.error('Error adding party:', error);
            throw error;
        }
    }
    async function deleteParty(partyId) {
        try {
            const response = await fetch(`/api/parties/${partyId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete party');
            }
            // After deleting, call renderParties() to update the list
            renderParties();
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    }

    function renderParty(party) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <strong>${party.name}</strong>
        <br>Date: ${party.date} | Time: ${party.time}
        <br>Location: ${party.location}
        <br>Description: ${party.description}
        <button class="deleteButton" data-party-id="${party.id}">Delete</button>
      `;
        partyList.appendChild(listItem);
    }
});