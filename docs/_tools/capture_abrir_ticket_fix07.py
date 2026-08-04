# -*- coding: utf-8 -*-
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from annotate import highlight

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "..", "abrir-ticket", "img")
BASE = "http://localhost:3000"
EMAIL = "ana.beatriz@empresa.com.br"
PASSWORD = "MinhaSenha123"

with open(os.path.join(HERE, "_ticket_id.txt")) as f:
    TICKET_ID = f.read().strip()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, locale="pt-BR")
    page = ctx.new_page()
    page.goto(BASE + "/login")
    page.wait_for_load_state("networkidle")
    page.fill('input[type="email"]', EMAIL)
    page.fill('input[type="password"]', PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_url("**/dashboard", timeout=20000)

    page.goto(BASE + f"/chamados/{TICKET_ID}")
    page.wait_for_load_state("networkidle")
    page.wait_for_selector("text=Detalhes", timeout=15000)
    page.wait_for_timeout(500)

    box = page.locator('textarea[placeholder*="Escreva sua mensagem"]')
    box.fill("Olá! Podem confirmar o prazo para a troca do produto?")
    area_box = box.bounding_box()
    path = os.path.join(IMG, "07-responder-equipe.png")
    page.screenshot(path=path, full_page=True)
    highlight(path, area_box)
    print("shot: 07-responder-equipe.png")
    browser.close()
