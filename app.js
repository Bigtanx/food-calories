// storage 
const StorageCtrl = (function(){
    //public methods
    return{
        storeItem: function(item){
            let items ;
            // check if ny item in local storage
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                // set is
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is in local storage
                items = JSON.parse(localStorage.getItem('items'));

                // push new item
                items.push('item');

                //reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage : function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();


//item controller
const ItemCtrl = (function () {
    //item construstor

    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data structure / state

    const data = {
        // items: [
        //     // { id: 0, name: 'steak Dinner', calories: 1200 },
        //     // { id: 0, name: 'cookie', calories: 1200 },
        //     // { id: 0, name: 'Eggs', calories: 1200 }
        // ],

        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }



    return {

        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {


            let ID;

            //create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;

                console.log(data.items, 'GOODD DAY');
            } else {
                ID = 0;

            }

            // calories to number
            calories = parseInt(calories);

            //create new item
            const newItem = new Item(ID, name, calories);


            //add to item array
            data.items.push(newItem);

            return newItem;


        },

        getItemById: function (id) {
            let found = null;
            // loop through item
            data.items.forEach(function (item) {

                if (item.id === id) {
                    found = item;
                }
            });
            return found;

        },
        deleteItem: function (id) {
            //get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove index
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },


        getTotalCalories: function () {
            let total = 0;


            // loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;

            });

            // set total cal in data structure
            data.totalCalories = total;


            // return total
            return data.totalCalories;

        },



        logData: function () {
            return data;
        }
    }

})();


//UI controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }


    // public method
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}</strong> <em> ${item.calories}Calories</em>
                    <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil"></i>
                    </a>
                </li>`
            });


            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }


        },
        addListItem: function (item) {
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;
            //add HTML 
            li.innerHTML = ` <strong>${item.name}</strong> <em> ${item.calories}Calories</em>
                    <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil"></i>
                    </a>`;

            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement
                ('beforeend', li)


        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.ShowEditState();

        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            })
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';


        },
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        ShowEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();


// APP controller

const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //load event listners
    const loadEventListeners = function () {
        // get ui selector
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // clear button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


    }

    //add item submit
    const itemAddSubmit = function (e) {
        //get form input from ui controller
        const input = UICtrl.getItemInput();

        // check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);


            //add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // storage in local storage
            StorageCtrl.storeItem(newItem);


            //clear fileds
            UICtrl.clearInput();


        }

        e.preventDefault();

    }

    //update item submit
    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get the list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            //break inti an array
            const listIdArr = listId.split('-');

            //get the actual id
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();


        }

        e.preventDefault();
    }

    //delete button event
    const itemDeleteSubmit = function (e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from ui
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //clear items event
    const clearAllItemsClick = function () {
        //delete all items from data structure
        ItemCtrl.clearAllItems();


        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);


        //remove from UI
        UICtrl.removeItems();

        // hide uL
        UICtrl.hideList();
    }



    // public methods
    return {
        init: function () {

            // clear edit state
            UICtrl.clearEditState();

            // fetch items from data structure
            const items = ItemCtrl.getItems();

            // check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items
                UICtrl.populateItemList(items);
            }

            // populate list with items
            UICtrl.populateItemList(items);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();

        }
    }


})(ItemCtrl, StorageCtrl, UICtrl);


// INITIALIZE APP
App.init();