function init() {
    // Flat list of all 'a' elements (in expected order), coming from 'g1'
    var listOfActions = [];
    let allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
    // Highlight the first element in the tree
    let liInd = null;

    let highlightAtInd = ind => {
        // Remove highlight from previous node
        if (liInd !== null) allLiElems[liInd].classList.remove('highlight');
        // Apply highlight to next node
        liInd = ind;
        allLiElems[liInd].classList.add('highlight');
        var pic = document.getElementById('pos');
        pic.src = "assets/" + allLiElems[liInd].innerHTML + ".jpg";
        var card = document.getElementById('card');
        card.innerHTML = allLiElems[liInd].innerHTML;
        listOfActions.push(allLiElems[liInd].innerHTML + " highlighted");
    };

    window.addEventListener('keydown', evt => {
        if (![38, 40].includes(evt.keyCode)) return;

        // Get the new index; ensure it doesn't over/underflow
        let newInd = liInd + ((evt.keyCode === 38) ? -1 : +1);
        if (newInd < 0) newInd = allLiElems.length - 1;
        if (newInd >= allLiElems.length) newInd = 0;

        highlightAtInd(newInd);
        evt.preventDefault();
    });

    let addSpouseBtn = document.getElementById('addSpouse');
    addSpouseBtn.addEventListener('click', addSpouse => {

        if (document.getElementById("nameInput").value.length > 1) {
            // Create the 'a' to append
            var node = document.createElement("a");
            var fromInput = document.getElementById("nameInput").value;
            var textnode = document.createTextNode(fromInput);
            node.setAttribute('href', '#');
            node.appendChild(textnode);

            if (allLiElems[liInd].parentNode.children[0] != null && allLiElems[liInd].parentNode.children[1] != null &&
                allLiElems[liInd].parentNode.children[0].nodeName == "A" && allLiElems[liInd].parentNode.children[1].nodeName == "A") {
                alert('You can only be married to one person!');
                listOfActions.push("Error on adding a 2nd spouse to " + allLiElems[liInd].innerHTML);
            } else {
                // Append the node behind the currently selected node
                allLiElems[liInd].parentNode.insertBefore(node, allLiElems[liInd].parentNode.children[1]);
                // Remove the highlight from currently selected element
                allLiElems[liInd].classList.remove('highlight');
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
                listOfActions.push("Added spouse " + fromInput + " to " + allLiElems[liInd].innerHTML);
                document.getElementById("nameInput").value = "";
            }
        } else {
            alert('The name you have entered appears to be a bit short. Please enter a name that is at least 2 characters long.');
            listOfActions.push("Error: Adding a spouse with a name that is too short.");
        }
        assignButtons();

    });

    let addSiblingBtn = document.getElementById('addSibling');
    addSiblingBtn.addEventListener('click', addSibling => {
        if (document.getElementById("nameInput").value.length > 1) {
            var node = document.createElement("li");
            var textInput = document.getElementById("nameInput").value;
            // Create the 'a' to append
            var innerNode = document.createElement("a");
            var textnode = document.createTextNode(textInput);
            innerNode.setAttribute('href', '#');
            innerNode.appendChild(textnode);
            node.appendChild(innerNode);

            // Append the node behind the currently selected node
            allLiElems[liInd].parentNode.parentNode.append(node);
            // Remove the highlight from currently selected element
            allLiElems[liInd].classList.remove('highlight');
            // Update the array of 'a' nodes
            allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));

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
        if (document.getElementById("nameInput").value.length > 1) {
            var node = document.createElement("li");
            var textInput = document.getElementById("nameInput").value;
            // Create the 'a' to append
            var innerNode = document.createElement("a");
            var textnode = document.createTextNode(textInput);
            innerNode.setAttribute('href', '#');
            innerNode.appendChild(textnode);
            node.appendChild(innerNode);

            // Append the node below the currently selected node
            var allItems = allLiElems[liInd].parentNode.children
            if (allItems[allItems.length - 1].children.length > 0) {
                allItems[allItems.length - 1].appendChild(node);
                // Remove the highlight from currently selected element
                allLiElems[liInd].classList.remove('highlight');
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));

                document.getElementById("nameInput").value = "";
                listOfActions.push("Added a child with the name " + textInput + " to " + allLiElems[liInd].innerHTML);

                highlightAtInd(0);
            } else if (allLiElems[liInd].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id != 'g1') {
                var ulList = document.createElement('ul');
                ulList.appendChild(node);
                allLiElems[liInd].parentNode.appendChild(ulList);
                // Remove the highlight from currently selected element
                allLiElems[liInd].classList.remove('highlight');
                // Update the array of 'a' nodes
                allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
                listOfActions.push("Added a child with the name " + textInput + " to " + allLiElems[liInd].innerHTML);
                document.getElementById("nameInput").value = "";
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
        if (allLiElems[liInd].parentNode.children.length > 1) {
            if (allLiElems[liInd].parentNode.children[0].nodeName == 'A' && allLiElems[liInd].parentNode.children[1].nodeName == 'UL') {
                alert("Sorry, children need to have at least 1 parent.");
                listOfActions.push("Error: Children need to have at least 1 parent.");
                return null;
            }
        }
        // Remove the selected node
        allLiElems[liInd].parentNode.removeChild(allLiElems[liInd]);
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
                    highlightAtInd(0);
                    li.parentNode.removeChild(li);
                }
            }
        }
        listOfActions.push(allLiElems[liInd].innerHTML + " was removed.");
        allLiElems = Array.from(document.getElementById('g1').getElementsByTagName('a'));
        assignButtons();
    });

    let question = document.getElementById('fixedbutton');
    question.addEventListener('click', logaction);

    function logaction() {
        var outputText = "\n";
        for (var i in listOfActions)
            outputText = outputText + listOfActions[i] + "\n";
        var session = document.getElementById('sessionElements');
        session.innerText = outputText;
    }
    // Allows the user to also click on the elements
    var assignButtons = function () {
        for (var i = 0, len = allLiElems.length; i < len; i++) {
            (function (index) {
                allLiElems[i].onclick = function () {
                    highlightAtInd(index);
                }
            })(i);
        }
    }
    assignButtons();
    highlightAtInd(0);
}