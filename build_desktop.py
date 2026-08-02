import os
import subprocess
import sys
import shutil

def run(cmd, cwd=None):
    print(f"\n--- Running: {' '.join(cmd) if isinstance(cmd, list) else cmd} ---")
    res = subprocess.run(cmd, shell=True, cwd=cwd)
    if res.returncode != 0:
        print(f"Command failed with returncode {res.returncode}")
        sys.exit(res.returncode)

def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Step 1: Run Next.js static export build
    print("Building Next.js static export...")
    run("npm run build", cwd=project_dir)
    
    out_dir = os.path.join(project_dir, 'out')
    if not os.path.exists(out_dir):
        print(f"Error: Output directory {out_dir} does not exist!")
        sys.exit(1)
        
    print(f"[OK] Next.js static export created successfully at {out_dir}")
    
    # Step 2: Run PyInstaller
    print("Packaging into standalone executable with PyInstaller...")
    pyinstaller_cmd = [
        "pyinstaller",
        "--noconsole",
        "--onefile",
        f"--add-data={out_dir}{os.path.pathsep}out",
        "--name=TokenRunout",
        "desktop_runner.py"
    ]
    
    run(pyinstaller_cmd, cwd=project_dir)
    
    exe_path = os.path.join(project_dir, 'dist', 'TokenRunout.exe')
    if os.path.exists(exe_path):
        size_mb = os.path.getsize(exe_path) / (1024 * 1024)
        print(f"\n==================================================")
        print(f"SUCCESS! Standalone Desktop Executable Built!")
        print(f"Executable Path: {exe_path}")
        print(f"File Size: {size_mb:.2f} MB")
        print(f"==================================================\n")
    else:
        print("Build completed, but dist/TokenRunout.exe was not found.")

if __name__ == '__main__':
    main()
