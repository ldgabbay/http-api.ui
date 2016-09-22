#!/usr/bin/env python
import SimpleHTTPServer
import SocketServer
import os

class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")


if __name__ == '__main__':
	os.chdir('site-root')
	httpd = SocketServer.TCPServer(("", 8080), MyHTTPRequestHandler)
	httpd.serve_forever()
