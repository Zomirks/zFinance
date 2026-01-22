const categories = ['Salaire', 'Courses', 'Abonnements', 'Transport', 'Autres', 'Loisirs', 'Santé', 'Remboursement'];
const statuses = ['completed', 'pending', 'failed'];

function randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

function randomAmount(category) {
    if (category === 'Salaire' || category === 'Remboursement') {
        return Math.floor(Math.random() * 3000) + 50;
    }
    return parseFloat((-Math.random() * 200).toFixed(2));
}

function randomDescription(category) {
    const options = {
        'Salaire': ['Salaire'],
        'Courses': ['Carrefour', 'Leclerc', 'Auchan', 'Marché Bio'],
        'Abonnements': ['Netflix', 'Spotify', 'Disney+', 'Prime Video'],
        'Transport': ['Essence', 'Ticket de bus', 'Uber', 'Train'],
        'Autres': ['Cadeau', 'Dépense imprévue', 'Divers'],
        'Loisirs': ['Cinéma', 'Festival', 'Restaurant', 'Bar'],
        'Santé': ['Pharmacie', 'Médecin', 'Dentiste'],
        'Remboursement': ['Remboursement ami', 'Remboursement collègue']
    };
    const arr = options[category];
    return arr[Math.floor(Math.random() * arr.length)];
}

const mockTransactions = Array.from({ length: 20 }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    return {
        id: (i + 1).toString(),
        amount: randomAmount(category),
        description: randomDescription(category),
        category,
        date: randomDate(new Date(2024, 0, 1), new Date()),
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };
});

export default mockTransactions;