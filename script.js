async function callHumeAI(input) {
    const response = await fetch('https://your-api-endpoint/api/hume-ai', { // Replace with your actual API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.result; // Adjust based on your actual API response
}

document.getElementById('openEvi').onclick = function() {
    document.getElementById('eviModal').style.display = 'block';
};

document.getElementById('closeEvi').onclick = function() {
    document.getElementById('eviModal').style.display = 'none';
};

document.getElementById('sendMessage').onclick = async function() {
    const userInput = document.getElementById('userInput').value;
    const outputDiv = document.getElementById('eviOutput');

    outputDiv.innerText = "Processing...";

    try {
        const result = await callHumeAI(userInput);
        outputDiv.innerText = result; // Display the result
    } catch (error) {
        console.error('Error calling Hume AI:', error);
        outputDiv.innerText = "Error: " + error.message; // Show error message
    }
};
