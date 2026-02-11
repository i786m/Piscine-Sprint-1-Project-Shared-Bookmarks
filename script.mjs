import { getUserIds, getData, setData } from './storage.mjs';

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

function displayBookmarks () {
	const selectedUser   = document.getElementById('user-select');
	const bookmarkList   = document.getElementById("bookmark-list");
	const existData 	 = getData(selectedUser.value)
	
	bookmarkList.innerHTML = "";

	if( existData && existData.length > 0 ) {
		[...existData].reverse().forEach((bookmarkData) => {
			const listItem = document.createElement("li");
			
			listItem.innerHTML = `
				<div class="bookmark-list-item" >
					<a href="${bookmarkData.url}" target="_blank">
					${bookmarkData.title}
					</a>
					<p> ${bookmarkData.description} </p>
					<button class="like-bookmark" type="button" > Likes ${bookmarkData.likes} </button>
					<button class="copy-link" type= "button" > Copy Link </button>
					<p id="bookmark-timestamp"> ${bookmarkData.timestamp}</p>
				</div>
			`
			
			bookmarkList.appendChild(listItem);

			// add event listener to like the bookmark and count the likes
        		const likesBookmark = listItem.querySelector(".like-bookmark");
			likesBookmark.addEventListener('click', function() {
				bookmarkData.likes += 1

				setData(selectedUser.value, existData);
				selectedUser.dispatchEvent(new Event('change'));
			});

			// add copy link button for each bookmark, implement copy-to-clipboard 
        		const copyLinkBtn = listItem.querySelector(".copy-link");
			copyLinkBtn.addEventListener("click", function() {
				navigator.clipboard.writeText(bookmarkData.url);
          			copyLinkBtn.textContent = "Copied!";

				setTimeout(() => {
					copyLinkBtn.textContent = "Copy Link";
				}, 1000);
			});
		});
	
	} else {
		const noData = document.createElement("div")
      	noData.innerHTML = `
			<h3> There are no bookmarks for this user yet...!!</h3>
            `

      	bookmarkList.appendChild(noData);
	}

}

function addBookmark(event) {
	event.preventDefault();

	const urlInput = document.getElementById('bookmark-url');
	const url = urlInput.value.trim();
	const titleInput = document.getElementById('bookmark-title');
	const title = titleInput.value.trim();
	const descriptionInput = document.getElementById('description');
	const description = descriptionInput.value.trim();
	const userSelector = document.getElementById('user-select');
	const userId = userSelector.value;

	if (userId === 'Select a user') {
		showFeedback('Please select a user.', true);
		return;
	}

	if (!url || !title || !description) {
		showFeedback('Please enter a URL, a title, and a description.', true);
		return;
	}

	if (!isValidUrl(url)) {
		showFeedback('Please enter a valid URL.', true);
		return;
	}

	const userBookmarks = getData(userId) || [];
	const newBookmark = {
		url,
		title,
		description,
		likes: 0,
		timestamp: new Date().toLocaleString(),
	};
	userBookmarks.push(newBookmark);
	setData(userId, userBookmarks);
	urlInput.value = '';
	titleInput.value = '';
	descriptionInput.value = '';
	displayBookmarks();
	showFeedback('Bookmark added successfully!');
}

function showFeedback(message, isError = false) {
	const feedback = document.getElementById('form-feedback');
	feedback.textContent = message;
	feedback.style.background = isError ? '#c0392b' : '#218838';
	feedback.style.display = 'block';
	setTimeout(() => {
		feedback.style.display = 'none';
	}, 3000);
}

function isValidUrl(string) {
	try {
		new URL(string.startsWith('http') ? string : 'https://' + string);
		return true;
	} catch {
		return false;
	}
}

function setupEventListeners() {
	const addBookmarkForm = document.getElementById('add-bookmark-form');
	addBookmarkForm.addEventListener('submit', addBookmark);

	const userSelector = document.getElementById('user-select');
	userSelector.addEventListener('change', displayBookmarks);
}


window.onload = function () {
	populateUserSelector();
	setupEventListeners();
};
