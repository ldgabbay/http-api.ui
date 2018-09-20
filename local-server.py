#!/usr/bin/env python
import SimpleHTTPServer
import SocketServer
import argparse
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
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', '-p', default=8080, type=int)
    args = parser.parse_args()

    os.chdir(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'site-root'))
    httpd = SocketServer.TCPServer(("", args.port), MyHTTPRequestHandler)
    httpd.serve_forever()
