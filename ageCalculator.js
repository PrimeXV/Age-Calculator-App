// Select all input elements
const inputEL = document.querySelectorAll("input");
// Select all label elements
const labelEL = document.querySelectorAll("label");
// Select the error message
const errorEL = document.querySelectorAll("small");
// Select the button element
const buttonEL = document.querySelector("button");
// Select the result container
const resultContainer = document.querySelector(".result-container");

// Function to calculate age
function calculateAge(day, month, year) {
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();
  const ageInMilliseconds = currentDate - birthDate;
  const ageInSeconds = ageInMilliseconds / 1000;
  const ageInMinutes = ageInSeconds / 60;
  const ageInHours = ageInMinutes / 60;
  const ageInDays = ageInHours / 24;
  const ageInMonths = ageInDays / 30.44; // Average number of days in a month
  const ageInYears = ageInMonths / 12;

  return {
    years: Math.floor(ageInYears),
    months: Math.floor(ageInMonths) % 12,
    days: Math.floor(ageInDays) % 365,
  };
}

// Function to display error
function displayError(i, message) {
  // Add the "error" class to the label
  labelEL[i].classList.add("error");
  // Change the input border color to light red
  inputEL[i].style.borderColor = "var(--Light-red)";
  // Display an error message
  errorEL[i].style.display = "block";
  errorEL[i].textContent = message;
}

// Function to animate number from start to end
function animateValue(id, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  const element = document.getElementById(id);
  const timer = setInterval(function () {
    current += increment;
    element.textContent = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Function to validate input fields and calculate age
function validateInputFieldsAndCalculateAge() {
  // Get the current date
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based
  const currentYear = currentDate.getFullYear();

  // Loop through each label element
  for (let i = 0; i < labelEL.length; i++) {
    // Check if the input value is empty
    if (inputEL[i].value === "") {
      displayError(i, "The field is required");
    } else if (i === 0 && (inputEL[i].value < 1 || inputEL[i].value > 31)) {
      // Check if day is not between 1-31
      displayError(i, "Must be a valid day");
    } else if (i === 1 && (inputEL[i].value < 1 || inputEL[i].value > 12)) {
      // Check if month is not between 1-12
      displayError(i, "Must be a valid month");
    } else if (
      i === 2 &&
      (inputEL[i].value > currentYear ||
        (inputEL[i].value == currentYear && inputEL[1].value > currentMonth) ||
        (inputEL[i].value == currentYear &&
          inputEL[1].value == currentMonth &&
          inputEL[0].value > currentDay))
    ) {
      // Check if date is in the future
      displayError(i, "Must be in the past");
    } else if (
      i !== 2 &&
      new Date(
        inputEL[2].value,
        inputEL[1].value - 1,
        inputEL[0].value
      ).getDate() != inputEL[0].value
    ) {
      // Check if date is invalid
      displayError(i, "Date is invalid");
      inputEL[1].style.borderColor = "var(--Light-red)";
      labelEL[1].classList.add("error");

      inputEL[2].style.borderColor = "var(--Light-red)";
      labelEL[2].classList.add("error");
      return; // Prevent further processing
    } else {
      // If all validations pass, calculate age
      const age = calculateAge(
        inputEL[0].value,
        inputEL[1].value,
        inputEL[2].value
      );

      // Set the innerHTML of resultContainer
      resultContainer.innerHTML = `
        <h1><span id="years">0</span>years</h1>
        <h1><span id="months">0</span>months</h1>
        <h1><span id="days">0</span>days</h1>`;

      // Animate the values
      animateValue("years", 0, age.years, 1000); // 1000ms for years
      animateValue("months", 0, age.months, 1000); // 1000ms for months
      animateValue("days", 0, age.days, 1000); // 1000ms for days
    }
  }
}

// Add a click event listener to the button
buttonEL.addEventListener("click", validateInputFieldsAndCalculateAge);

// Add a 'keyup' event listener to the document for the 'Enter' key
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    validateInputFieldsAndCalculateAge();
  }
});
