const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.querySelector('.grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

//   Edit option

let editElement;
let editFlag = false;
let editId = "";
///Load Contents
window.addEventListener("DOMContentLoaded", setupItems);
//form
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);



function addItem(e){
    e.preventDefault();
    const value = grocery.value; 
    const id = new Date().getTime().toString();

    if(value && !editFlag){
        createItemList(id, value);
        ///////After value is added to the list displays the success message
        dsiplayAlerts("Item added to the list", "success");

        /// show Container
        container.classList.add("show-container");

        ////Store it in a localStorage
        addLocalStorage(id, value)


        //////Set back to default

        setBackToDefault()
    }else if(value && editFlag){
       editElement.innerHTML = value;
       dsiplayAlerts("value changed", "success");
       editLocalStorage(editId,value)
       setBackToDefault();
    }else{
        dsiplayAlerts("Please Enter Value", "danger")
    }
}

function dsiplayAlerts(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}
///////Delete Item
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    dsiplayAlerts("Item removed", "danger");
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    removeFromLocalStorage(id);
    setBackToDefault();
}

///function for Edit Item
function editItems(e){
    const element = e.currentTarget.parentElement.parentElement;
    //Accessing sibling which is Title
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;

    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";
}

////function for clear item
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    dsiplayAlerts("List is empty!", "success");
    setBackToDefault();
    localStorage.removeItem("list");
}

//////funciton for Default Back

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
}

/////function for Local storage

function addLocalStorage(id, value){
    const grocery = {id,value};
    const items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

////
function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem("list", JSON.stringify(items));
}

///Edit local Storage 
function editLocalStorage(id, value){
    let items = getLocalStorage()
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item
    });
    localStorage.setItem("list", JSON.stringify(items));
}
/****Function for Getting value from local storage*** */
function getLocalStorage(){
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): [];
}
/*****Function For window content Loaded**** */
function setupItems(){
    let items = getLocalStorage()
    if(items.length > 0){
        items.forEach(function(item){
            createItemList(item.id, item.value);
        })
        container.classList.add('show-container');
    }
    
}

function createItemList(id, value){
    const element = document.createElement("article")
        element.classList.add("grocery-item");
        const attr = document.createAttribute("data-id");
        element.setAttributeNode(attr)
        attr.value = id;
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`
        const deleteBtn = element.querySelector('.delete-btn')
       deleteBtn.addEventListener("click", deleteItem);
       const editBtn = element.querySelector('.edit-btn')
       editBtn.addEventListener("click", editItems);
        


        ///element should be append to the Grocery list
        list.appendChild(element);
}