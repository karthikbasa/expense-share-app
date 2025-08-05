const GROUP_KEY = 'expenseGroups';

// Load all groups from localStorage
export function getGroups() {
    const raw = localStorage.getItem(GROUP_KEY);
    return raw ? JSON.parse(raw) : [];
}

// Save a new group with complete structure
export function addGroup(name, users = [], status = 'active') {
    const groups = getGroups();
    const newGroup = {
        name,
        users,
        status,
        expenses: [],      // ✅ Always present
        settledAt: null    // ✅ Consistent shape
    };
    localStorage.setItem(GROUP_KEY, JSON.stringify([...groups, newGroup]));
}

// Load all users
export const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || [];
};

// Save users to localStorage
export const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
};

// Add an expense to a specific group
export function addExpenseToGroup(groupName, expense) {
    const groups = getGroups();
    const updatedGroups = groups.map((group) => {
        if (group.name.trim().toLowerCase() === groupName.trim().toLowerCase()) {
            const expenses = group.expenses || [];
            return { ...group, expenses: [...expenses, expense] };
        }
        return group;
    });

    localStorage.setItem(GROUP_KEY, JSON.stringify(updatedGroups));
}

// Save all groups directly (used when overwriting entire list)
export function saveGroups(groups) {
    localStorage.setItem(GROUP_KEY, JSON.stringify(groups));
}