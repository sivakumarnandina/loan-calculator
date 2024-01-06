// CALCULATOR.JS

function calculateLoan() {
  var amount_input = parseInt(document.getElementById("principal").value);
  var rate_input = parseFloat(document.getElementById("rate").value);
  var time_input = parseInt(document.getElementById("time").value);

  var INTEREST = amount_input * (rate_input) * time_input / 100;
  var TOTAL = INTEREST + amount_input;

  document.querySelector(".m4").innerHTML = amount_input;
  document.querySelector(".m5").innerHTML = INTEREST;
  document.querySelector(".m6").innerHTML = TOTAL;

  // Prepare the loan data to be sent to the server
  var loanData = {
    amount: amount_input,
    interestRate: rate_input,
    months: time_input,
    monthlyPayment: TOTAL, // Assuming TOTAL is the monthly payment, modify accordingly
  };

  // Send the loan data to the server
  saveLoan(loanData);
}

function saveLoan(loanData) {
  // Send a POST request to save the loan data
  fetch('http://localhost:3000/api/loans', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData),
  })
      .then(response => response.json())
      .then(data => {
          console.log('Loan saved:', data);
          // After saving the loan, fetch all loans from the server
          fetchLoans();
      })
      .catch(error => console.error('Error saving loan:', error));
}

function fetchLoans() {
  // Fetch all loans from the server
  fetch('http://localhost:3000/api/loans')
      .then(response => response.json())
      .then(loans => {
          console.log('Loans fetched:', loans);
          // Display the fetched loans on the UI
          displayFetchedLoans(loans);
      })
      .catch(error => console.error('Error fetching loans:', error));
}

function displayFetchedLoans(loans) {
  // Modify this function based on how you want to display the fetched data in your UI
  var loansContainer = document.querySelector('.loans-container');
  loansContainer.innerHTML = ''; // Clear existing content

  loans.forEach(loan => {
      var loanElement = document.createElement('div');
      loanElement.innerHTML = `Amount: ${loan.amount}, Interest: ${loan.interestRate}, Months: ${loan.months}, Monthly Payment: ${loan.monthlyPayment}`;

      // Include buttons for update and delete operations
      var updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.onclick = function () {
          updateLoan(loan._id);
      };

      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function () {
          deleteLoan(loan._id);
      };

      loanElement.appendChild(updateButton);
      loanElement.appendChild(deleteButton);

      loansContainer.appendChild(loanElement);
  });
}

function updateLoan(loanId) {
  // Implement the logic to update the loan by ID
  // You may want to retrieve the existing data and display it in a form for modification
  // Then send a PUT request to update the data on the server
  console.log('Updating loan with ID:', loanId);
}

function deleteLoan(loanId) {
  // Send a DELETE request to delete the loan by ID
  fetch(`http://localhost:3000/api/loans/${loanId}`, {
      method: 'DELETE',
  })
      .then(response => {
          if (response.ok) {
              console.log('Loan deleted successfully');
              // After deleting the loan, fetch all loans from the server
              fetchLoans();
          } else {
              console.error('Error deleting loan');
          }
      })
      .catch(error => console.error('Error deleting loan:', error));
}
