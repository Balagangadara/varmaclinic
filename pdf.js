async function fetchLatestFile() {
    const repoOwner = 'Balagangadara'; // Replace with your GitHub username
    const repoName = 'Articles'; // Replace with your repository name
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

    try {
        // Fetch list of files from GitHub repository
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch repository contents: ${response.status}`);
        }
        const data = await response.json();

        // Filter and sort files to get the latest PDF
        const pdfFiles = data.filter(file => file.name.endsWith('.pdf'));
        pdfFiles.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

        if (pdfFiles.length === 0) {
            throw new Error('No PDF files found.');
        }

        // Get the latest file
        const latestFile = pdfFiles[0];

        // Update the Latest Article link and content display
        if (latestFile) {
            const rawUrl = `https://github.com/${repoOwner}/${repoName}/raw/main/${latestFile.path}`;
            const downloadLink = document.getElementById('latest-pdf-link');
            downloadLink.href = rawUrl;
            downloadLink.textContent = `Download Latest ${latestFile.name}`;
            document.getElementById('fileContent').textContent = `Latest PDF file is now available: ${latestFile.name}`;

            // Add click event listener to trigger download
            downloadLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior (navigating)
                downloadLatestFile(rawUrl);
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const downloadLink = document.getElementById('latest-pdf-link');
        downloadLink.textContent = 'Error loading files.';
        document.getElementById('fileContent').textContent = `Error: ${error.message}`;
    }
}

// Function to initiate download
function downloadLatestFile(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = true;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

window.onload = fetchLatestFile;
