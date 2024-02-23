"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector("form");
const taskList = document.querySelector(".task_list .table");
const opt_completed = `<span class="complete" onclick="completeTask(this)"><i class="fa fa-check green"></i></span>`;
const opt_delete = `<span class="delete" onclick="deleteTask(this)"><i class="fa fa-trash"></i></span>`;
const fetchUrl = "https://etr.lv/tasks";
function showTasks(tasks) {
    const options = tasks.completed ? opt_delete : opt_completed + opt_delete;
    const completed = tasks.completed ? "check green" : "times red";
    const newtodo = document.createElement("tr");
    newtodo.innerHTML = `
    <td>${tasks.task}</td>
    <td>${tasks.description}</td>
    <td class="td">${tasks.due}</td>
    <td class="td"><i class="fa fa-${completed}"></i></td>
    <td class="td">${options}</td>`;
    return newtodo;
}
function fetchTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(fetchUrl);
        const taskData = yield response.json();
        return taskData;
    });
}
function renderTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const taskData = yield fetchTasks();
            if (taskList) {
                taskData.forEach((tasks) => {
                    const listTask = showTasks(tasks);
                    taskList.appendChild(listTask);
                });
            }
            else {
                throw new Error("Task list not found!");
            }
        }
        catch (error) {
            alert(error);
        }
    });
}
function createNewTask(newTask) {
    return __awaiter(this, void 0, void 0, function* () {
        if (taskList) {
            const newTasks = showTasks(newTask);
            taskList.appendChild(newTasks);
            taskList.style.visibility = 'visible';
        }
        else {
            throw new Error("Task list not found!");
        }
    });
}
function completeTask(e) {
    const root = e.parentNode;
    const privious = root.previousElementSibling;
    const first = privious.firstChild;
    first.classList.remove("fa-times", "red");
    first.classList.add("fa-check", "green");
    e.remove();
}
function deleteTask(e) {
    const root = e.parentNode;
    root.parentNode.remove(root);
    if (taskList && taskList.rows.length <= 1) {
        taskList.style.visibility = 'hidden';
    }
}
renderTasks();
const inputFields = document.querySelectorAll("input, textarea");
const validationRules = {
    task: {
        required: true,
        minLength: 3,
        maxLength: 16,
    },
    date: {
        required: true,
    },
    description: {
        required: true,
        minLength: 3,
        maxLength: 200,
    },
};
function createErrorElement(message) {
    const errorElement = document.createElement("p");
    errorElement.classList.add("error");
    errorElement.textContent = message;
    return errorElement;
}
function checkIfErrorExists(inputField) {
    const inputParent = inputField.parentElement;
    return inputParent === null || inputParent === void 0 ? void 0 : inputParent.querySelector("p.error");
}
function displayError(message, inputField) {
    const errorElement = createErrorElement(message);
    const inputParent = inputField.parentElement;
    if (inputParent) {
        const errorExistsAlready = checkIfErrorExists(inputField);
        if (!errorExistsAlready) {
            inputParent.appendChild(errorElement);
        }
    }
}
if (form) {
    form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        let error = 0;
        inputFields.forEach((input) => {
            const inputId = input.name;
            if (inputId !== "task" &&
                inputId !== "date" &&
                inputId !== "description") {
                error = 1;
                return;
            }
            const inputValidation = validationRules[inputId];
            const inputValue = input.value;
            if (inputValidation.required && !inputValue) {
                displayError("Please fill in this field!", input);
                error = 1;
                return;
            }
            if (inputValidation.minLength &&
                inputValidation.minLength > inputValue.length) {
                displayError(`This should be at least from ${inputValidation.minLength} characters long`, input);
                error = 1;
                return;
            }
            if (inputValidation.maxLength &&
                inputValidation.maxLength < inputValue.length) {
                displayError(`This should be less or equal than ${inputValidation.maxLength} characters long`, input);
                error = 1;
                return;
            }
        });
        if (error === 0) {
            const random = Math.floor(Math.random() * 100) + 5;
            const newTask = {
                id: random,
                task: inputFields[0].value,
                description: inputFields[2].value,
                due: inputFields[1].value,
                completed: false,
            };
            createNewTask(newTask);
        }
    });
}
inputFields.forEach((input) => {
    input.addEventListener("input", () => {
        const errorElement = checkIfErrorExists(input);
        if (errorElement) {
            errorElement.remove();
        }
    });
});
