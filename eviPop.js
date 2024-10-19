const modal = document.getElementById("eviModal");
const openEviButton = document.getElementById("openEvi");
const closeEviButton = document.getElementById("closeEvi");

// Function to open the modal
openEviButton.onclick = function() {
    modal.style.display = "block";
    connectToEvi(); // Call function to connect to EVI
}

// Function to close the modal
closeEviButton.onclick = function() {
    modal.style.display = "none";
}

// Close modal if user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to connect to EVI
async function connectToEvi() {
    // Implement EVI connection logic here
    // For example, use WebSocket to connect to Hume's EVI
    console.log("Connecting to EVI...");
}

// Function to send user input to EVI
document.getElementById("sendMessage").onclick = function() {
    const userInput = document.getElementById("userInput").value;
    console.log("Sending to EVI:", userInput);
    // Implement logic to send user input to EVI and handle response
};
