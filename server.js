const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000; // Port number to listen on
const PUBLIC_DIR = path.join(__dirname, 'webapp'); // Directory containing your website files

// Create HTTP server
const server = http.createServer((req, res) => {
    // Get the file path based on the requested URL
    const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Check if the requested file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found, send 404 response
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // Read the file and send it as the response
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // Error reading file, send 500 response
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            
            // Determine the content type based on the file extension
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) {
                contentType = 'text/css';
            } else if (filePath.endsWith('.js')) {
                contentType = 'application/javascript';
            } else if (filePath.endsWith('.png')) {
                contentType = 'image/png';
            } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
                contentType = 'image/jpeg';
            }
            
            // Send the appropriate content type header
            res.writeHead(200, { 'Content-Type': contentType });
            
            // Send the file contents as the response body
            res.end(data);
        });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

