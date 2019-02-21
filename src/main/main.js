
const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1200, height: 800 })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function init() {
    // An array that holds all the actions taken in a session
    var listOfActions = [];
    // Flat list of all 'a' elements (in expected order), coming from 'g1'
    let allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
    // The current Element in our tree
    let liInd = null;

    let highlightAtInd = ind => {
        // Remove highlight from previous node
        if (liInd !== null) allLiElems[liInd].classList.remove('highlight');
        // Apply highlight to newly selected node
        liInd = ind;
        allLiElems[liInd].classList.add('highlight');
        // Set the picture and name
        var pic = document.getElementById('pos');
        pic.src = "assets/" + allLiElems[liInd].innerHTML + ".jpg";
        var card = document.getElementById('card');
        card.innerHTML = allLiElems[liInd].innerHTML;
        // Push the action taken to array
        listOfActions.push(allLiElems[liInd].innerHTML + " highlighted");
    };

    window.addEventListener('keydown', evt => {
        // If any other key clicked that is not Arrop UP/DOWN, do nothing
        if (![38, 40].includes(evt.keyCode)) return;

        // Get the new index; ensure it doesn't over/underflow
        let newInd = liInd + ((evt.keyCode === 38) ? -1 : +1);
        if (newInd < 0) newInd = allLiElems.length - 1;
        if (newInd >= allLiElems.length) newInd = 0;

        // Highlight the new tree item ...
        highlightAtInd(newInd);
        evt.preventDefault();
    });

    let addSpouseBtn = document.getElementById('addSpouse');
    addSpouseBtn.addEventListener('click', addSpouse => {
        var textInput = document.getElementById("nameInput").value;
        // Check that the length of the name is at least 2 characters long
        if (textInput.length > 1) {
            // Create the 'a' to append, add the name, make it href and put it all together
            var node = document.createElement("a");
            var textnode = document.createTextNode(textInput);
            node.setAttribute('href', '#');
            node.appendChild(textnode);

            // Make sure that there is 1 spouse only
            if (allLiElems[liInd].parentNode.children[0] != null && allLiElems[liInd].parentNode.children[1] != null &&
                allLiElems[liInd].parentNode.children[0].nodeName == "A" && allLiElems[liInd].parentNode.children[1].nodeName == "A") {
                alert('You can only be married to one person!');
                listOfActions.push("Error on adding a 2nd spouse to " + allLiElems[liInd].innerHTML);
            } else {
                // Append the node behind the currently selected node
                allLiElems[liInd].parentNode.insertBefore(node, allLiElems[liInd].parentNode.children[1]);
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
                // Add the action to the array and clear the form input
                listOfActions.push("Added spouse " + fromInput + " to " + allLiElems[liInd].innerHTML);
                document.getElementById("nameInput").value = "";
            }
        } else {
            alert('The name you have entered appears to be a bit short. Please enter a name that is at least 2 characters long.');
            listOfActions.push("Error: Adding a spouse with a name that is too short.");
        }
        // reassign the buttons
        assignButtons();

    });

    let addSiblingBtn = document.getElementById('addSibling');
    addSiblingBtn.addEventListener('click', addSibling => {
        // get again the form input and check if it is at least 2 characters
        var textInput = document.getElementById("nameInput").value;
        if (textInput.length > 1) {
            // build the node to append
            var node = createListItem(textInput);
            // Append the node to the selected items parents parent!
            allLiElems[liInd].parentNode.parentNode.append(node);
            // Update the array of 'a' nodes
            allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));

            // Clear the input and store the session
            document.getElementById("nameInput").value = "";
            listOfActions.push("Added a sibling with the name " + textInput + " to " + allLiElems[liInd].innerHTML);
        } else {
            alert('The name you have entered appears to be a bit short. Please enter a name that is at least 2 characters long.');
            listOfActions.push("Error: Adding a sibling with a name that is too short.");
        }
        assignButtons();
    });

    let addChildBtn = document.getElementById('addChild');
    addChildBtn.addEventListener('click', addChild => {
        var textInput = document.getElementById("nameInput").value;
        if (textInput.length > 1) {
            // build the node to append
            var node = createListItem(textInput);
            // Get the selected nodes parents children
            var allItems = allLiElems[liInd].parentNode.children;
            // If they already have children, just go ahead and append it
            // We don't need to check for more than 3 generations here, will do later...
            if (allItems[allItems.length - 1].children.length > 0) {
                allItems[allItems.length - 1].appendChild(node);
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
                // Clear the form and add the session element
                document.getElementById("nameInput").value = "";
                listOfActions.push("Added a child with the name " + textInput + " to " + allLiElems[liInd].innerHTML);
                // If the selected item is not the 3rd Generation, go ahead and add it!
            } else if (allLiElems[liInd].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id != 'g1') {
                var ulList = document.createElement('ul');
                ulList.appendChild(node);
                allLiElems[liInd].parentNode.appendChild(ulList);
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
                // Clear the output and add session element
                listOfActions.push("Added a child with the name " + textInput + " to " + allLiElems[liInd].innerHTML);
                document.getElementById("nameInput").value = "";
                // We are not allowed to add children for more than 3 generations, sorry!
            } else {
                alert("Sorry, this application only allows up to 3 generations.");
                listOfActions.push("Error: Only 3 generations are allowed in this application.");
            }
        } else {
            alert('The name you have entered appears to be a bit short. Please enter a name that is at least 2 characters long.');
            listOfActions.push("Error: Adding a child with a name that is too short.");
        }
        assignButtons();

    });

    let remBtn = document.getElementById('rem');
    remBtn.addEventListener('click', removeElement => {
        var parentOfSelected = allLiElems[liInd].parentNode;
        // If the selected item has at least 2 children, go ahead, else finish and display alert
        if (parentOfSelected.children.length > 1) {
            if (parentOfSelected.children[0].nodeName == 'A' && parentOfSelected.children[1].nodeName == 'UL') {
                alert("Sorry, children need to have at least 1 parent.");
                listOfActions.push("Error: Children need to have at least 1 parent.");
                return;
            }
        }
        // Remove the selected node
        parentOfSelected.removeChild(allLiElems[liInd]);
        // The method before removed only the 'a' but left the visual connection
        // and an empty <li>. This deletes all empty <li>'s
        var lis = document.getElementsByTagName('li');
        for (var i = 0; li = lis[i]; i++) {
            if (!li.hasChildNodes() || li.children.length == 0) {
                li.parentNode.removeChild(li);
            }
        }
        // We also need to check if any <ul> are now empty, or in other words:
        // If the parents have no kids, we need to get rid of the downwards link
        var lis = document.getElementsByTagName('ul');
        for (var i = 0; li = lis[i]; i++) {
            if (li.hasChildNodes()) {
                if (li.children.length == 0) {
                    li.parentNode.removeChild(li);
                }
            }
        }
        // Set the cursor to the start, add the session element, reassign array.
        highlightAtInd(0);
        listOfActions.push(allLiElems[liInd].innerHTML + " was removed.");
        allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
        assignButtons();
    });

    // The session button 
    let question = document.getElementById('fixedbutton');
    question.addEventListener('click', logaction);

    // Display all the session entries nicely and tidied in the modal
    function logaction() {
        var outputText = "\n";
        for (var i in listOfActions)
            outputText = outputText + listOfActions[i] + "\n";
        var session = document.getElementById('sessionElements');
        session.innerText = outputText;
    }

    // Allows the user to also click on the elements, assigns onClick events to all buttons
    var assignButtons = function () {
        for (var i = 0, len = allLiElems.length; i < len; i++) {
            (function (index) {
                allLiElems[i].onclick = function () {
                    highlightAtInd(index);
                }
            })(i);
        }
    }

    // helper function, creates the nodes
    function createListItem(text) {
        var node = document.createElement("li");
        var innerNode = document.createElement("a");
        var textnode = document.createTextNode(text);
        innerNode.setAttribute('href', '#');
        innerNode.appendChild(textnode);
        node.appendChild(innerNode);
        return node;
    }

    // Finish the initialisation by highlighting the first element
    // And assigning the onClick functions to the buttons
    assignButtons();
    highlightAtInd(0);
}

var a = 1;

var b = 2;

// End