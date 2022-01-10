// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

const greatIdeas = [];
const authors = [];

// define variables that reference elements on our page
const greatIdeasForm = document.forms[0];
const greatIdeaInput = greatIdeasForm.elements["greatIdea"]; 
const greatIdeasList = document.getElementById("greatIdeas"); 
const clearButton = document.querySelector('#clear-greatIdeas');

const authorsForm = document.forms[1];
const authorInput = authorsForm.elements["author"];
const authorsList = document.getElementById("authors");
const clearButtonAuthors = document.querySelector('#clear-authors');

// request the Great Ideas from our app's sqlite database
fetch("/getGreatIdeas", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(row => {
      appendNewGreatIdea(row.greatIdea);
    });
  });
// a helper function that creates a list item for a given Great Idea
const appendNewGreatIdea = greatIdea => {
// const newOrderedListItem = document.createElement("ol"); 
  const newListItem = document.createElement("li");
  newListItem.innerText = greatIdea;
  greatIdeasList.appendChild(newListItem);
};

// listen for the form to be submitted and add a new Great Idea when it is
greatIdeasForm.onsubmit = event => {
  event.preventDefault();
  const data = { greatIdea: greatIdeaInput.value };

   fetch("/addGreatIdea", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  
   .then(res => res.json())
   .then(response => {
     console.log(JSON.stringify(response));
    }); 
 
  // get Great Idea value and add it to the list
  greatIdeas.push(greatIdeaInput.value);
  appendNewGreatIdea(greatIdeaInput.value);
 
   // reset form
  greatIdeaInput.value = "";
  greatIdeaInput.focus();
  };

  clearButton.addEventListener('click', event => {
  fetch("/clearGreatIdeas", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared greatIdeas");
    });
  greatIdeasList.innerHTML = "";
}); 

// request the authors from our app's sqlite database
fetch("/getAuthors", {})
    .then(res => res.json())
    .then(response => {
      response.forEach(row => {
        appendNewAuthor(row.author);
      });
    });

// a helper function that creates a list item for a given author
const appendNewAuthor = author => {
  const newListItem = document.createElement("li");
  newListItem.innerText = author;
  authorsList.appendChild(newListItem);
};

// listen for the form to be submitted and add a new author when it is
authorsForm.onsubmit = event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  const dataAuthor = { author: authorInput.value };
     
  fetch("/addAuthor", {
    method: "POST",
    body: JSON.stringify(dataAuthor),
    headers: { "Content-Type": "application/json" }
  })
  
    .then(res => res.json())
    .then(response => {
      console.log(JSON.stringify(response));
    });
  
// get author value and add it to the list
  authors.push(authorInput.value);
  appendNewAuthor(authorInput.value);

   // reset form
  authorInput.value = "";
  authorInput.focus();
 };

clearButtonAuthors.addEventListener('click', event => {
  fetch("/clearAuthors", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared authors");
    });
  authorsList.innerHTML = "";
});


