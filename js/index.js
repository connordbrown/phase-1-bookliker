document.addEventListener("DOMContentLoaded", () => {
    fetchAllBooks();
});


function fetchAllBooks() {
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(data => displayBookList(data))
}


function displayBookList(bookData) {
    const bookList = document.querySelector('#list');
    bookData.forEach(book => {
        const li = document.createElement('li');
            li.id = book.id;
            li.textContent = book.title;
            // add event listener during creation of element to include id
            li.addEventListener('click', () => fetchBook(li.id));
        bookList.appendChild(li);
    })
}


function fetchBook(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
      .then(response => response.json())
      .then(data => displayBookInfo(data))
}


function displayBookInfo(book) {
    // clear panel before loading new book
    const showPanel = document.querySelector('#show-panel');
        showPanel.textContent = "";

    // get object values using destructuring assignment
    const {img_url, description, users, id} = book;
        // assign values to HTML elements
        const thumbnail = document.createElement('img');
            thumbnail.src = img_url;
        const descr = document.createElement('p');
            descr.textContent = description;
        const fans = document.createElement('ul');
            fans.id = 'fans';
        users.forEach(user => {
            const fan = document.createElement('li');
            fan.textContent = user.username;
            fans.appendChild(fan);
        })
        // add like button after book info
        const likeBtn = document.createElement('button');
            likeBtn.textContent = 'LIKE'; 
            likeBtn.addEventListener('click', () => likeBook(id, users));

    // append to DOM
    showPanel.appendChild(thumbnail);
    showPanel.appendChild(descr);
    showPanel.appendChild(fans);
    showPanel.appendChild(likeBtn);
}


function likeBook(bookId, userList) {
    // hard-coded user
    const currUser = {"id": 2, "username": "auer"};
    let updateData;

    // check if user in userList
    const userFound = userList.find(user => user.id === currUser.id);
    // change update data: remove user if in userList, else add user to userList
    // NOTE: be specific with filter criteria
    if (userFound) {
        updateData = {"users": userList.filter(user => user.id !== currUser.id)};
    } else {
        updateData = {"users": [...userList, currUser ]};
    }

    const updateObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updateData) 
    }

    // send patch request to specific book id, then display the updated book info
    fetch(`http://localhost:3000/books/${bookId}`, updateObj)
      .then(response => response.json())
      .then(updatedBook => displayBookInfo(updatedBook))
      .catch(error => alert(error.message)) 
}
