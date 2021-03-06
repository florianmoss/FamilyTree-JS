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

        // if no picture with the set name is found, set a defualt
        pic.onerror = function (e) {
            pic.src = "assets/default.jpg";
        };
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

    let changeBtn = document.getElementById('changeName');
    changeBtn.addEventListener('click', changeName => {
        var textInput = document.getElementById("nameInput").value;
        if (textInput.length > 1) {
            var oldName = allLiElems[liInd].innerHTML;
            allLiElems[liInd].innerHTML = textInput;
            assignButtons();
            listOfActions.push(oldName + " changed name to " + textInput);
            document.getElementById("nameInput").value = "";
            highlightAtInd(liInd);

        } else {
            alert('The name you have entered appears to be a bit short. Please enter a name that is at least 2 characters long.');
            listOfActions.push("Error: Trying to change a name while new name is too short.");
        }
    });

    let newTreeBtn = document.getElementById('newTree');
    newTreeBtn.addEventListener('click', startNew => {
        newTreeBtn.style.visibility = 'hidden';
        document.getElementById('rootInput').style.display = 'block';
        document.getElementById('newRoot').style.display = 'block';
    });

    let newRootBtn = document.getElementById('newRoot');
    newRootBtn.addEventListener('click', setRoot => {
        var textInput = document.getElementById("rootInput").value;

        document.getElementById('rootInput').style.display = 'none';
        document.getElementById('newRoot').style.display = 'none';
        document.getElementById('g1').style.display = 'block';
        document.getElementById('pictureCard').style.display = 'block';
        document.getElementById('functionality').style.display = 'block';

        allLiElems[0].innerHTML = textInput;
        assignButtons();
        listOfActions.push("A family root was set: " + textInput);

        highlightAtInd(0);
    });

    let reloadBtn = document.getElementById('reload');
    reloadBtn.addEventListener('click', function () {
        location.reload();
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
}
// End