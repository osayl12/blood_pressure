document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const navEnter = document.getElementById('nav-enter');
    const navHistory = document.getElementById('nav-history');
    const navSummary = document.getElementById('nav-summary');

    const sectionEnter = document.getElementById('section-enter');
    const sectionHistory = document.getElementById('section-history');
    const sectionSummary = document.getElementById('section-summary');

    // Navigation event listeners
    navEnter.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('enter');
    });
    navHistory.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('history');
    });
    navSummary.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('summary');
    });

    function showSection(section) {
        sectionEnter.style.display = (section === 'enter') ? 'block' : 'none';
        sectionHistory.style.display = (section === 'history') ? 'block' : 'none';
        sectionSummary.style.display = (section === 'summary') ? 'block' : 'none';
    }