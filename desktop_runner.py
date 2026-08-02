import os
import sys
import threading
import http.server
import socketserver
import webview

class WindowApi:
    """IPC bridge available to JavaScript in webview via window.pywebview.api"""
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def set_always_on_top(self, on_top: bool):
        if self.window:
            self.window.on_top = on_top
            return True
        return False

    def set_mode(self, mode: str):
        """Toggle between compact widget mode and expanded dashboard mode"""
        if not self.window:
            return False
        if mode == "compact":
            self.window.resize(320, 480)
            self.window.on_top = True
        else:
            self.window.resize(1150, 800)
            self.window.on_top = False
        return True

    def minimize(self):
        if self.window:
            self.window.minimize()
            return True
        return False

    def close(self):
        if self.window:
            self.window.destroy()
            return True
        return False


def get_out_directory():
    """Locate out directory whether running as raw python script or PyInstaller bundle"""
    if hasattr(sys, '_MEIPASS'):
        base_dir = sys._MEIPASS
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
    
    out_dir = os.path.join(base_dir, 'out')
    return out_dir


def start_local_server(out_dir):
    """Start an in-process HTTP server bound exclusively to loopback (127.0.0.1) on a random free port"""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=out_dir, **kwargs)
        def log_message(self, format, *args):
            pass  # suppress console log noise

    # Bind to 127.0.0.1 (loopback only - no firewall popup) on port 0 (random free port)
    httpd = socketserver.TCPServer(('127.0.0.1', 0), Handler)
    port = httpd.server_address[1]
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    return f'http://127.0.0.1:{port}'


def main():
    out_dir = get_out_directory()
    if not os.path.exists(out_dir):
        print(f"Error: Static directory not found at {out_dir}.")
        return

    url = start_local_server(out_dir)
    api = WindowApi()
    
    # Create webview window pointing to local loopback URL
    window = webview.create_window(
        title='Token Runout - AI Token Runway Tracker',
        url=url,
        width=1150,
        height=800,
        min_size=(320, 380),
        resizable=True,
        easy_drag=True,
        js_api=api,
        background_color='#0f172a'
    )
    api.set_window(window)
    
    # Start webview loop (uses native Windows Edge WebView2)
    webview.start(debug=False)


if __name__ == '__main__':
    main()
