function search() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h2').innerText.toLowerCase();
        const answer = item.querySelector('.answer').innerText.toLowerCase();
        const containsKeyword = question.includes(searchInput) || answer.includes(searchInput);

        if (containsKeyword) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleAnswer(id) {
    const answer = document.getElementById(`answer${id}`);
    const icon = document.getElementById(`icon${id}`);

    if (answer.style.display === 'none') {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        document.getElementById(`question${id}`).classList.add('icon-visible');
    } else {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        document.getElementById(`question${id}`).classList.remove('icon-visible');
    }
}