import sys
import os
import traceback
from alembic.config import Config
from alembic import command

# Log everything to a file since stdout capture is flaky
log_file = "alembic_run.log"

def log(msg):
    with open(log_file, "a") as f:
        f.write(str(msg) + "\n")

if os.path.exists(log_file):
    os.remove(log_file)

try:
    log("Starting script...")
    
    cwd = os.getcwd()
    log(f"CWD: {cwd}")
    
    if cwd not in sys.path:
        sys.path.append(cwd)
        log(f"Added CWD to sys.path")

    ini_path = os.path.abspath("alembic.ini")
    log(f"Ini path: {ini_path}")
    
    if not os.path.exists(ini_path):
        log("ERROR: alembic.ini not found!")
        sys.exit(1)

    alembic_cfg = Config(ini_path)
    # Force script location to be absolute
    script_location = os.path.abspath("alembic")
    alembic_cfg.set_main_option("script_location", script_location)
    log(f"Script location forced to: {script_location}")

    log("Calling command.upgrade...")
    command.upgrade(alembic_cfg, "head")
    log("Upgrade command returned.")

except Exception as e:
    log(f"EXCEPTION: {e}")
    log(traceback.format_exc())

log("Script finished.")
