import { getUserIds } from './storage.mjs';

function populateUserSelector() {
	const users = getUserIds();
	const userSelector = document.getElementById('user-select');

	userSelector.innerHTML = '';

	const defaultOption = document.createElement('option');
	defaultOption.textContent = 'Select a user';
	defaultOption.selected = true;
	defaultOption.disabled = true;
	userSelector.appendChild(defaultOption);

	users.forEach(user => {
		const option = document.createElement('option');
		option.value = user;
		option.textContent = `User ${user}`;
		userSelector.appendChild(option);
	});
}

window.onload = function () {
	populateUserSelector();
};
