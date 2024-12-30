# Utility
import os
import json
import requests
import validators

# UrlDNA
from urldna import UrlDNA

# Configuration
TELEGRAM_TOKEN = os.environ["TELEGRAM_TOKEN"]
URLDNA_API_KEY = os.environ["URLDNA_API_KEY"]

def send_scan(url: str) -> dict:
    """
    Create scan by given URL
    :param url: URL to scan
    :return: Scan ID
    """
    # urlDNA client
    client = UrlDNA(URLDNA_API_KEY)
    # Create new scan
    scan = client.async_create_scan(url)

    return scan.id

def validate_url(url: str) -> str:
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"
    return url

def send_message(chat_id, text):
    """
    Send telegram message:    
    :param chat_id: Chat ID
    :param text: BOT message text
    """
    print("[%s] BOT: %s" %(chat_id, text))
    headers = {"Content-Type": "application/json"}
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text
    })
    requests.post("https://api.telegram.org/bot{}/sendMessage".format(TELEGRAM_TOKEN), headers=headers, data=payload)

def process_message(chat_id, text):
    """
    Process telegram message by chat id and text
    :param chat_id: Chat ID
    :param text: user message text
    """
    if text == "/start":
        send_message(chat_id, "Welcome to the URLDNA Bot! Use /help to see available commands.")
    elif text == "/help":
        send_message(chat_id, "Available commands:\n"
        "/start - Start interacting with the bot\n"
        "/help - Show this help message\n"
        "/scan <URL> - Submit a URL for scanning")
    elif text.startswith("/scan"):
        # Get url
        url = text.split("/scan")[-1].strip()
        url = validate_url(url)
        if validators.url(url):
            send_message(chat_id, "Creating new scan, please wait")
            try:
                # Get scan
                scan_id = send_scan(url)
                # Send urlDNA scan URL
                send_message(chat_id, "http://urldna.io/scan/" + scan_id)
            except:
                send_message(chat_id, "Creating new scan, please wait")
        else:            
            send_message(chat_id, "Failed to create scan")
    else:
        send_message(chat_id, "Unknown command. Use /help to see available commands.")


def process(request):
    """
    Process Telegram Webook Request
    :param: Httml Request
    """
    # Get message
    request_json = request.get_json()
    message = request_json.get("message")
    if message:
        chat_id = message.get("chat").get("id")
        text = message.get("text")
        
        print("[%s] USER: %s" %(chat_id, text))

        process_message(chat_id, text)
    
    return "OK"
