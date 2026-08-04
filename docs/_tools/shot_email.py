# -*- coding: utf-8 -*-
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "..", "email-lancamento", "convite-central-atendimento.html")
uri = "file:///" + os.path.abspath(HTML).replace("\\", "/")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    ctx = browser.new_context(viewport={"width": 700, "height": 1400}, color_scheme="light")
    page = ctx.new_page()
    page.goto(uri)
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(HERE, "email_preview_light.png"), full_page=True)
    ctx.close()

    ctx = browser.new_context(viewport={"width": 700, "height": 1400}, color_scheme="dark")
    page = ctx.new_page()
    page.goto(uri)
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(HERE, "email_preview_dark.png"), full_page=True)
    ctx.close()

    ctx = browser.new_context(viewport={"width": 390, "height": 1400}, color_scheme="light")
    page = ctx.new_page()
    page.goto(uri)
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(HERE, "email_preview_mobile.png"), full_page=True)
    ctx.close()

    browser.close()
print("ok")
