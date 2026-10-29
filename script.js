const studentForm = document.getElementById("studentForm");

const studentIdInput = document.getElementById("studentId");
const fullNameInput = document.getElementById("fullName");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const contactInput = document.getElementById("contact");
const addressInput = document.getElementById("address");

const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
const resetBtn = document.getElementById("resetBtn");

const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const emptyMessage = document.getElementById("emptyMessage");

let students = [];

try {
const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
students = Array.isArray(savedStudents) ? savedStudents : [];
} catch (error) {
console.error("Could not load saved student records:", error);
}

let editId = null;

function saveToLocalStorage() {
try {
localStorage.setItem("students", JSON.stringify(students));
return true;
} catch (error) {
alert("Could not save records. Your browser storage may be full or unavailable.");
console.error(error);
return false;
}
}

function clearErrors() {
document.querySelectorAll(".error").forEach((error) => {
error.textContent = "";
});
}

function setError(inputId, message) {
const errorElement = document.getElementById(inputId + "Error");
if (errorElement) {
errorElement.textContent = message;
}
}

function validateForm() {
clearErrors();

let isValid = true;

const id = studentIdInput.value.trim();
const name = fullNameInput.value.trim();
const age = Number(ageInput.value);
const email = emailInput.value.trim();
const course = courseInput.value.trim();
const contact = contactInput.value.trim();
const address = addressInput.value.trim();

if (!id) {
setError("studentId", "Student ID is required.");
isValid = false;
} else if (
students.some(
(student) => student.studentId === id && student.studentId !== editId
)
) {
setError("studentId", "This Student ID already exists.");
isValid = false;
}

if (!name) {
setError("fullName", "Full name is required.");
isValid = false;
}

if (!ageInput.value.trim()) {
setError("age", "Age is required.");
isValid = false;
} else if (!Number.isInteger(age) || age < 1 || age > 120) {
setError("age", "Enter a whole-number age between 1 and 120.");
isValid = false;
}

if (!email) {
setError("email", "Email is required.");
isValid = false;
} else if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email)) {
setError("email", "Enter a valid email address.");
isValid = false;
}

if (!course) {
setError("course", "Course is required.");
isValid = false;
}

if (!contact) {
setError("contact", "Contact number is required.");
isValid = false;
} else if (!/^[0-9+-\s()]{7,20}$/.test(contact)) {
setError("contact", "Enter a valid contact number.");
isValid = false;
}

if (!address) {
setError("address", "Address is required.");
isValid = false;
}

return isValid;
}

function createTextElement(tag, label, value) {
const element = document.createElement(tag);

if (label) {
const strong = document.createElement("strong");
strong.textContent = label + ": ";
element.appendChild(strong);
}

element.appendChild(document.createTextNode(String(value ?? "")));
return element;
}

function createActionButton(label, className, action) {
const button = document.createElement("button");
button.type = "button";
button.textContent = label;
button.className = className;
button.addEventListener("click", action);
return button;
}

function displayStudents(studentArray = students) {
studentList.replaceChildren();

if (studentArray.length === 0) {
emptyMessage.classList.remove("hidden");
emptyMessage.textContent =
students.length === 0
? "No student records yet. Add your first student using the form."
: "No students match your search.";
return;
}

emptyMessage.classList.add("hidden");

studentArray.forEach((student) => {
const card = document.createElement("article");

```
card.className =
  "student-card border border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50 hover:shadow-md transition";

const heading = document.createElement("h3");
heading.className = "text-xl font-bold text-blue-700 mb-3";
heading.textContent = student.fullName;
card.appendChild(heading);

card.appendChild(createTextElement("p", "Student ID", student.studentId));
card.appendChild(createTextElement("p", "Age", student.age));
card.appendChild(createTextElement("p", "Email", student.email));
card.appendChild(createTextElement("p", "Course", student.course));
card.appendChild(createTextElement("p", "Contact", student.contact));
card.appendChild(createTextElement("p", "Address", student.address));

const actions = document.createElement("div");
actions.className = "flex flex-wrap gap-3 mt-4";

actions.appendChild(
  createActionButton(
    "Edit",
    "bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition",
    () => editStudent(student.studentId)
  )
);

actions.appendChild(
  createActionButton(
    "Delete",
    "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition",
    () => deleteStudent(student.studentId)
  )
);

card.appendChild(actions);
studentList.appendChild(card);
```

});
}

studentForm.addEventListener("submit", function (event) {
event.preventDefault();

if (!validateForm()) {
return;
}

const student = {
studentId: studentIdInput.value.trim(),
fullName: fullNameInput.value.trim(),
age: ageInput.value.trim(),
email: emailInput.value.trim(),
course: courseInput.value.trim(),
contact: contactInput.value.trim(),
address: addressInput.value.trim(),
};

let updatedStudents;

if (editId === null) {
updatedStudents = [...students, student];
} else {
updatedStudents = students.map((oldStudent) =>
oldStudent.studentId === editId ? student : oldStudent
);
}

const previousStudents = students;
students = updatedStudents;

if (!saveToLocalStorage()) {
students = previousStudents;
return;
}

resetForm();
renderDashboard();
});

function editStudent(id) {
const student = students.find((item) => item.studentId === id);
if (!student) return;

studentIdInput.value = student.studentId;
fullNameInput.value = student.fullName;
ageInput.value = student.age;
emailInput.value = student.email;
courseInput.value = student.course;
contactInput.value = student.contact;
addressInput.value = student.address;

editId = student.studentId;

formTitle.textContent = "Edit Student";
submitBtn.textContent = "Update Student";

clearErrors();
studentForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteStudent(id) {
const confirmed = confirm("Are you sure you want to delete this student?");
if (!confirmed) return;

const previousStudents = students;
students = students.filter((student) => student.studentId !== id);

if (!saveToLocalStorage()) {
students = previousStudents;
return;
}

if (editId === id) {
resetForm();
}

renderDashboard();
}

searchInput.addEventListener("input", function () {
renderDashboard();
});

clearAllBtn.addEventListener("click", function () {
if (students.length === 0) {
alert("There are no student records to clear.");
return;
}

const confirmed = confirm(
"Are you sure you want to permanently clear all student records from this browser?"
);

if (!confirmed) return;

const previousStudents = students;
students = [];

if (!saveToLocalStorage()) {
students = previousStudents;
return;
}

resetForm();
renderDashboard();
});

resetBtn.addEventListener("click", resetForm);

function resetForm() {
studentForm.reset();
clearErrors();

editId = null;
formTitle.textContent = "Add Student";
submitBtn.textContent = "Add Student";
}

function renderDashboard() {
const searchValue = searchInput.value.trim().toLowerCase();

const filteredStudents = students.filter((student) =>
[
student.studentId,
student.fullName,
student.course,
student.email,
].some((value) => String(value ?? "").toLowerCase().includes(searchValue))
);

displayStudents(filteredStudents);
}

displayStudents();
