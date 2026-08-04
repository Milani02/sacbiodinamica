# -*- coding: utf-8 -*-
"""Continuacao: a conta ja foi criada no passo anterior, so falta logar e
capturar o painel com o botao Abrir ticket destacado."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from annotate import highlight

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "..", "criar-conta", "img")
BASE = "http://localhost:3000"
EMAIL = "ana.beatriz@empresa.com.br"
PASSWORD = "MinhaSenha123"

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
    page.wait_for_load_state("networkidle")
    page.wait_for_selector("text=Abrir ticket", timeout=15000)
    page.wait_for_timeout(500)
    btn_box = page.locator("text=Abrir ticket").first.bounding_box()
    path = os.path.join(IMG, "05-painel-do-cliente.png")
    page.screenshot(path=path, full_page=True)
    highlight(path, btn_box)
    print("shot: 05-painel-do-cliente.png")
    browser.close()
