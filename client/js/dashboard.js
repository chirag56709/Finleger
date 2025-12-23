// ================= AUTH =================
const token = localStorage.getItem("token");
if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

// ================= LOGOUT =================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// ================= ELEMENTS =================
const incomeInput = document.getElementById("incomeInput");
const saveIncomeBtn = document.getElementById("saveIncome");
const resetIncomeBtn = document.getElementById("resetIncome");

const totalIncomeEl = document.getElementById("totalIncome");
const totalExpensesEl = document.getElementById("totalExpenses");
const balanceEl = document.getElementById("balance");

const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");

// ================= DATA =================
let totalIncome = 0;
let expenses = [];
let editIndex = null; // track editing expense

// ================= RENDER DASHBOARD =================
function renderDashboard() {
  let totalExpenses = 0;
  expenseTable.innerHTML = "";

  expenses.forEach((exp, index) => {
    totalExpenses += Number(exp.amount);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.title}</td>
      <td>${exp.category}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;
    expenseTable.appendChild(row);
  });

  totalIncomeEl.textContent = `₹${totalIncome}`;
  totalExpensesEl.textContent = `₹${totalExpenses}`;
  balanceEl.textContent = `₹${totalIncome - totalExpenses}`;
}

// ================= INCOME =================
saveIncomeBtn.addEventListener("click", () => {
  const value = Number(incomeInput.value);

  if (value <= 0) {
    alert("Please enter valid income");
    return;
  }

  totalIncome = value;
  incomeInput.value = "";
  renderDashboard();
});

resetIncomeBtn.addEventListener("click", () => {
  if (!confirm("Reset income and all expenses?")) return;

  totalIncome = 0;
  expenses = [];
  renderDashboard();
});

// ================= ADD / UPDATE EXPENSE =================
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (totalIncome === 0) {
    alert("Please set income first");
    return;
  }

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  if (amount <= 0) {
    alert("Invalid amount");
    return;
  }

  if (editIndex === null) {
    // ADD MODE
    expenses.push({ title, category, amount, date });
  } else {
    // EDIT MODE (SAFE UPDATE)
    expenses[editIndex] = { title, category, amount, date };
    editIndex = null;
  }

  expenseForm.reset();
  renderDashboard();
});

// ================= EDIT EXPENSE =================
window.editExpense = function (index) {
  const exp = expenses[index];

  document.getElementById("title").value = exp.title;
  document.getElementById("category").value = exp.category;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("date").value = exp.date;

  editIndex = index;
};

// ================= DELETE EXPENSE =================
window.deleteExpense = function (index) {
  if (confirm("Delete this expense?")) {
    expenses.splice(index, 1);
    renderDashboard();
  }
};

// ================= INIT =================
renderDashboard();
