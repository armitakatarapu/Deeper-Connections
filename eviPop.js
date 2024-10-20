const modal = document.getElementById("eviModal");
const openEviButton = document.getElementById("openEvi");
const closeEviButton = document.getElementById("closeEvi");

openEviButton.onclick = function() {
    modal.style.display = "block";
    connectToEvi(); 
}

closeEviButton.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function connectToEvi() {
    
    console.log("Connecting to EVI...");
}

document.getElementById("sendMessage").onclick = function() {
    const userInput = document.getElementById("userInput").value;
    console.log("Sending to EVI:", userInput);
};
