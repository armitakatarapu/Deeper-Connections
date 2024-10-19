document.getElementById("submitBtn").addEventListener("click", function() {
    const userInput = document.getElementById("userInput").value;
    const responseDiv = document.getElementById("response");
    responseDiv.innerText = "You said: " + userInput;
    document.getElementById("userInput").value = ''; // Clear input
});
