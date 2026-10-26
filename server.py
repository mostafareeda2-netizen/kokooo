import http.server
import socketserver
import os
import cgi

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class RomanticHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/upload':
            try:
                content_type = self.headers.get('Content-Type', '')
                if 'multipart/form-data' in content_type:
                    form = cgi.FieldStorage(
                        fp=self.rfile,
                        headers=self.headers,
                        environ={'REQUEST_METHOD': 'POST',
                                 'CONTENT_TYPE': content_type}
                    )
                    if 'video' in form:
                        file_item = form['video']
                        assets_dir = os.path.join(DIRECTORY, 'assets')
                        os.makedirs(assets_dir, exist_ok=True)
                        dest_path = os.path.join(assets_dir, 'video.mp4')
                        with open(dest_path, 'wb') as f:
                            f.write(file_item.file.read())
                        
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(b'{"status":"success","message":"Video saved permanently"}')
                        return
                
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"status":"error","message":"Invalid upload"}')
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'{{"status":"error","message":"{str(e)}"}}'.encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), RomanticHandler) as httpd:
        print(f"Romantic Server running at http://localhost:{PORT}")
        httpd.serve_forever()
