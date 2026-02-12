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
	const userId         = document.getElementById('user-select').value;
	const bookmarkList   = document.getElementById("bookmark-list");
	const bookmarks 	   = getData(userId)
	
	bookmarkList.innerHTML = "";

	if( bookmarks && bookmarks.length > 0 ) {
		[...bookmarks].reverse().forEach((bookmark) => {
			const listItem = document.createElement("li");
			
			listItem.innerHTML = `
				<div class="bookmark-list-item" >
					<a href="${bookmark.url}" target="_blank">
					${bookmark.title}
					</a>
					<p> ${bookmark.description} </p>
					<button class="like-bookmark" type="button" > Likes ${bookmark.likes} </button>
					<button class="copy-link" type= "button" > Copy Link </button>
					<p id="bookmark-timestamp"> ${bookmark.timestamp}</p>
				</div>
			`
			
			bookmarkList.appendChild(listItem);

			// add event listener to like the bookmark and count the likes
        		const likesBookmark = listItem.querySelector(".like-bookmark");
			likesBookmark.addEventListener('click', function() {
				bookmark.likes += 1

				setData(userId, bookmarks);
				document.getElementById('user-select').dispatchEvent(new Event('change'));
			});

			// add copy link button for each bookmark, implement copy-to-clipboard 
        		const copyLinkBtn = listItem.querySelector(".copy-link");
			copyLinkBtn.addEventListener("click", function() {
				navigator.clipboard.writeText(bookmark.url);
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

	const url 		= document.getElementById('bookmark-url').value.trim();
	const title 	= document.getElementById('bookmark-title').value.trim();
	const description = document.getElementById('description').value.trim();
	const userId 	= document.getElementById('user-select').value;

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
	event.target.reset();
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
