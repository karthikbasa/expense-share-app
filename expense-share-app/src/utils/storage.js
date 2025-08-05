const GROUP_KEY = 'expenseGroups';

export function getGroups() {
  const raw = localStorage.getItem(GROUP_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addGroup(name, users = [], status = 'active') {
  const groups = getGroups();
  const newGroup = { name, users, status };
  localStorage.setItem(GROUP_KEY, JSON.stringify([...groups, newGroup]));
}

export const getUsers = () => {
  return JSON.parse(localStorage.getItem('users')) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export function addExpenseToGroup(groupName, expense) {
  const groups = getGroups();
  const updatedGroups = groups.map((group) => {
    if (group.name === groupName) {
      const expenses = group.expenses || [];
      return { ...group, expenses: [...expenses, expense] };
    }
    return group;
  });

  localStorage.setItem(GROUP_KEY, JSON.stringify(updatedGroups));
};

export function saveGroups(groups) {
  localStorage.setItem(GROUP_KEY, JSON.stringify(groups));
};
