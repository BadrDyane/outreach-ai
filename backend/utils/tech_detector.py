def detect_tech_stack(html: str, headers: dict) -> list[str]:
    tech = []
    html_lower = html.lower()

    checks = {
        "React":        ["react-dom", "__react", "react.production.min"],
        "Next.js":      ["_next/static", "__next", "next.js"],
        "Vue.js":       ["vue.js", "vue.min.js", "__vue__"],
        "Angular":      ["ng-version", "angular.min.js"],
        "WordPress":    ["wp-content/themes", "wp-includes/js", "wp-content/plugins"],
        "Shopify":      ["cdn.shopify", "shopify.com/s/"],
        "Webflow":      ["webflow.com/css", "webflow.js"],
        "Wix":          ["wixstatic.com", "wix.com/_api"],
        "Squarespace":  ["squarespace.com/universal", "static.squarespace"],
        "Stripe":       ["js.stripe.com", "stripe.com/v3"],
        "HubSpot":      ["hs-scripts.com", "hubspot.com/hs-fs", "hsforms"],
        "Intercom":     ["intercom.io/js", "widget.intercom"],
        "Crisp":        ["crisp.chat", "client.crisp.chat"],
        "Typeform":     ["typeform.com/embed", "embed.typeform"],
        "Calendly":     ["calendly.com/assets", "assets.calendly"],
        "Google Analytics": ["google-analytics.com/analytics", "gtag/js?id="],
        "Hotjar":       ["static.hotjar.com", "hotjar-"],
        "Tailwind":     ["tailwindcss.com", "tailwind.min.css"],
        "Bootstrap":    ["bootstrap.min.css", "bootstrap.bundle.min"],
    }

    for name, signals in checks.items():
        if any(s in html_lower for s in signals):
            tech.append(name)

    # Header-based detection
    server      = headers.get("server", "").lower()
    powered_by  = headers.get("x-powered-by", "").lower()

    if "nginx" in server:   tech.append("Nginx")
    if "apache" in server:  tech.append("Apache")
    if "php" in powered_by: tech.append("PHP")
    if "express" in powered_by: tech.append("Node.js / Express")

    cf_ray = headers.get("cf-ray", "")
    if cf_ray or "cloudflare" in server:
        tech.append("Cloudflare")

    return list(dict.fromkeys(tech))[:8]