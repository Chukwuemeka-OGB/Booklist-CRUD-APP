//Book CLass : Represent a book created
class Book{
    constructor(title, author, ISBN){
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
    }
}


//UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();
        //Looping through all the books in array then call add method to list
        books.forEach((book)=>{
            UI.addBookToList(book); //calling method
        });
    }
    
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.ISBN}</td>
        <td><a href="#" class="btn btn-warning btn-sm"><i class='bx bxs-trash delete'></i></a></td>
        `;

        list.appendChild(row);
    }
    //method to delete a book entry
    static deleteBook(target){ //target is a random name to represent parameter(it could be any other name)
        if(target.classList.contains('delete')){
           if(window.confirm('Are you sure you want to delete this entry?')){
                const DelRow = target.parentElement.parentElement.parentElement; //gets the entire row
                DelRow.remove(); //deletes the row
                const DelRowTitle = DelRow.children[0].textContent; //gets title of row to be deleted
            UI.showAlert(`"${DelRowTitle}" has been removed 💨 `, 'danger'); //displays title in delete message
           }
        }
    }
    static showAlert(message, className){
        const div  = document.createElement('div'); //creating message div
        div.className = `alert alert-${className}`; //assigning className
        div.appendChild(document.createTextNode(message)); //Appending message Text to the div
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); //container(parentElement), we insert div before form in container
        //Disappear after 3.5 seconds
        //set timeout takes a function as first param and the time in milliseconds as second param
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);    
    }
    //method to clear fields after each entry
    static clearFields(){
        document.querySelector('#title').value ='';
        document.querySelector('#author').value ='';
        document.querySelector('#isbn').value ='';
    }
    
}
//Store Class: Handles Storage
class Store{
    static getBooks(){
        let books;
        //checking if books is in locale storage if it isnt assign blank array to books
        if(localStorage.getItem('books') === null){ 
            books = [];
        }else{ //if books is in lstorage then get it and convert to json format
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;

    }
    static addBook(book){
        const books = Store.getBooks();
        
        books.push(book); //push book 

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(ISBN){ //remove book by isbn
        const books = Store.getBooks();

        books.forEach((book, index)=>{
            if(book.ISBN === ISBN){
                books.splice(index, 1); //slicing book out of books array if isbn match
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    //get form values 
    const title = document.querySelector('#title').value;  
    const author = document.querySelector('#author').value;  
    const ISBN = document.querySelector('#isbn').value;  

    //Validation
    if(title === '' || author === '' || ISBN === ''){
        UI.showAlert('Enter all  Field values', 'danger') //calling showAlert() method with message value and classNmae of danger(for color red);
    }else{
        //Instantiate book
        const book = new Book(title, author, ISBN);
        //Add Book To List
        UI.addBookToList(book);

        //Add book to localeStorage
        Store.addBook(book);


        //Show Success message
        UI.showAlert(`"${title}" has been added ✔ `, 'success');

        //Calling method clear fields 
        UI.clearFields();    
    }

  
})

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from LocaleStorage
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);
})