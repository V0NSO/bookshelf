const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function pungsiId(){
	return +new Date();
}

function addListBook() {
  const titleBook = document.getElementById('inputBookTitle').value;
  const authorBook = document.getElementById('inputBookAuthor').value;
  const yearBook = document.getElementById('inputBookYear').value;
  const isCompleted = document.getElementById('inputBookIsComplete').checked;
  const bookObject = pungsiBookObject(titleBook, authorBook, yearBook, isCompleted); // Updated function call
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  SimpenData();
}

function pungsiBookObject(title, author, year, isCompleted) {
  const id = pungsiId();
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}
function buatbuuk(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis : ' + bookObject.author;
  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun : ' + bookObject.year;
  const textContainer = document.createElement('div');
  textContainer.classList.add('book_item');
  textContainer.append(textTitle, textAuthor, textYear);
 
  const container = document.createElement('div');
  container.classList.add('book_list', 'book_item');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);
 
  if (bookObject.isCompleted) {  	
  	const undoButton = document.createElement('button');
  	undoButton.innerText = 'Belum selesai dibaca';
  	undoButton.style.marginLeft='3px'
  	undoButton.addEventListener('click', function () {
    	undoBookFromCompleted(bookObject.id);
  	});

  	const removeButton = document.createElement('button');
		removeButton.innerText = 'Hapus buku';
  	removeButton.classList.add('red');
  	removeButton.addEventListener('click', function () {
    	removeBook(bookObject.id);
  	});
  	container.append(undoButton, removeButton);
	}
  else {
    const finishButton = document.createElement('button');
    finishButton.innerText = 'Selesai dibaca';
    finishButton.classList.add('green');  
    finishButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Hapus buku';
    removeButton.classList.add('red'); 
    removeButton.addEventListener('click', function () {
      removeBook(bookObject.id);
    });
    container.append(finishButton, removeButton);
  }
  return container;  
}
function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  SimpenData();
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
      alert ('Browser tidak mendukung local storage');
      return false;
  }
  return true;
}

function SimpenData() {
  if (isStorageExist()) {
      const books_parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, books_parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function loadDataDariStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
      for (const book of data) {
          books.push(book);
      }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  SimpenData();

}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  SimpenData();
}
 
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
} 

document.addEventListener('DOMContentLoaded', function () {
  const dataForm = document.getElementById('inputBook');  
  dataForm.addEventListener('submit', function (event) {
    event.preventDefault();
		addListBook();
  });
  if (isStorageExist()) {
    loadDataDariStorage();
}
});

document.addEventListener(SAVED_EVENT, () => {
 console.log('Semua Data Sudah Tersimpan!');
});

document.addEventListener(RENDER_EVENT, function () {
	console.log(books);
  const uncompletedBookList = document.getElementById('incompleteBookshelfList');
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookshelfList');
  completedBookList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = buatbuuk(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    }
     else {
      completedBookList.append(bookElement);
		}  
  }
});

document.getElementById('searchBook').addEventListener('submit', function(){
event.preventDefault();
  const findbook = document.getElementById('searchBookTitle').value.toLowerCase();
  const barisBuku = document.querySelectorAll('.book_item');
  for(let book of barisBuku){
    const title = book.firstElementChild.innerText.toLowerCase();
    if(title.includes(findbook )){
      book.style.display = 'block';
    }else{
      book.style.display = 'none';

    }

  }

})


















