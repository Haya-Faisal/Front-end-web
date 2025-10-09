// Book database - you can expand this with more books
const bookDatabase = [
    "The Great Gatsby",
    "To Kill a Mockingbird",
    "1984",
    "Pride and Prejudice",
    "The Catcher in the Rye",
    "The Lord of the Rings",
    "Harry Potter and the Sorcerer's Stone",
    "The Hobbit",
    "The Da Vinci Code",
    "The Alchemist",
    "The Hunger Games",
    "The Book Thief",
    "The Kite Runner",
    "Life of Pi",
    "The Chronicles of Narnia",
    "Brave New World",
    "Animal Farm",
    "Gone with the Wind",
    "The Shining",
    "It",
    "The Stand",
    "Dune",
    "Foundation",
    "The Martian",
    "Ready Player One",
    "The Girl on the Train",
    "Gone Girl",
    "The Silent Patient",
    "Where the Crawdads Sing",
    "The Night Circus"
];

// Global variables
let currentSuggestions = [];
let selectedSuggestionIndex = -1;

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestionsDropdown = document.getElementById('suggestionsDropdown');
const banner = document.querySelector('.banner');
const container = document.querySelector('.container');

// Initialize the search functionality
function initSearch() {
    // Add event listeners
    searchInput.addEventListener('focus', handleSearchActive);
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('blur', handleSearchBlur);
    searchInput.addEventListener('keypress', handleKeyPress);
    searchInput.addEventListener('keydown', handleArrowKeys);
    searchButton.addEventListener('click', handleSearch);
    
    console.log('Search functionality initialized');
}

// Event handlers
function handleSearchActive() {
    // Hide the "Ready to Read?" text
    banner.style.opacity = '0';
    banner.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    // Move search bar and button up to 40% from top
    container.style.top = '40%';
    container.style.transform = 'translateX(-50%)';
    
    // Add active class for additional styling
    container.classList.add('search-active');
    
    // Show suggestions if there's already text
    if (searchInput.value.length > 0) {
        showSuggestions(searchInput.value);
    }
}

function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
        showSuggestions(query);
    } else {
        hideSuggestions();
    }
}

function handleSearchBlur() {
    // Delay hiding suggestions to allow for clicking on them
    setTimeout(() => {
        hideSuggestions();
        
        // Only reset if input is empty
        if (searchInput.value.trim() === '') {
            resetSearchUI();
        }
    }, 200);
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        if (selectedSuggestionIndex >= 0 && currentSuggestions.length > 0) {
            // Use the selected suggestion
            searchInput.value = currentSuggestions[selectedSuggestionIndex];
            hideSuggestions();
            handleSearch();
        } else {
            handleSearch();
        }
    }
}

function handleArrowKeys(e) {
    if (!suggestionsDropdown.classList.contains('active')) return;
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, currentSuggestions.length - 1);
        updateSelectedSuggestion();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        updateSelectedSuggestion();
    }
}

// Suggestion functions
function showSuggestions(query) {
    currentSuggestions = getSuggestions(query);
    selectedSuggestionIndex = -1;
    
    if (currentSuggestions.length > 0) {
        renderSuggestions(currentSuggestions, query);
        suggestionsDropdown.classList.add('active');
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    suggestionsDropdown.classList.remove('active');
    currentSuggestions = [];
    selectedSuggestionIndex = -1;
}

function getSuggestions(query) {
    const lowercaseQuery = query.toLowerCase();
    return bookDatabase
        .filter(book => book.toLowerCase().includes(lowercaseQuery))
        .slice(0, 5); // Show max 5 suggestions
}

function renderSuggestions(suggestions, query) {
    const lowercaseQuery = query.toLowerCase();
    suggestionsDropdown.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = suggestion;
        
        // Highlight matching text
        const lowercaseSuggestion = suggestion.toLowerCase();
        const matchIndex = lowercaseSuggestion.indexOf(lowercaseQuery);
        if (matchIndex !== -1) {
            const beforeMatch = suggestion.substring(0, matchIndex);
            const match = suggestion.substring(matchIndex, matchIndex + query.length);
            const afterMatch = suggestion.substring(matchIndex + query.length);
            
            suggestionElement.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
        }
        
        suggestionElement.addEventListener('mousedown', () => {
            searchInput.value = suggestion;
            hideSuggestions();
            handleSearch();
        });
        
        suggestionsDropdown.appendChild(suggestionElement);
    });
}

function updateSelectedSuggestion() {
    const items = suggestionsDropdown.querySelectorAll('.suggestion-item');
    
    items.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.style.background = '#f0f0f0';
        } else {
            item.style.background = '';
        }
    });
    
    if (selectedSuggestionIndex >= 0) {
        searchInput.value = currentSuggestions[selectedSuggestionIndex];
    }
}

function resetSearchUI() {
    // Show the "Ready to Read?" text again
    banner.style.opacity = '1';
    banner.style.transform = 'translate(-50%, -50%) scale(1)';
    
    // Move search bar back to center
    container.style.top = '50%';
    container.style.transform = 'translateX(-50%)';
    
    // Remove active class
    container.classList.remove('search-active');
}

function handleSearch() {
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery === '') {
        alert('Please enter a book title to search');
        return;
    }
    
    // Store the search query in localStorage to pass to second page
    localStorage.setItem('searchQuery', searchQuery);
    
    // Navigate to second page
    window.location.href = 'secondpage.html';
}

// Public API for external use
const SearchManager = {
    init: initSearch,
    
    // Method to add books to the database dynamically
    addBooks: function(newBooks) {
        bookDatabase.push(...newBooks);
    },
    
    // Method to get all books (for debugging)
    getBookDatabase: function() {
        return [...bookDatabase];
    },
    
    // Method to clear search
    clearSearch: function() {
        searchInput.value = '';
        hideSuggestions();
        resetSearchUI();
    }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

// Make SearchManager available globally
window.SearchManager = SearchManager;