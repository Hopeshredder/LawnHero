import re

def build_user_prompt(payload: dict):
    # FROM YARD INFO
    yard_name = payload["yard_name"]
    zip_code = payload["zip_code"]
    yard_size = payload["yard_size"]
    soil_type = payload["soil_type"]
    grass_type = payload["grass_type"]
    # FROM PREFS
    watering_interval = payload["watering_interval"]
    watering_rate = payload["watering_rate"]
    mowing_interval = payload["mowing_interval"]

    facts = [
        f"yard name: {yard_name}",
        f"zipcode: {zip_code}",
        f"yard size: {yard_size}",
        f"soil type: {soil_type}",
        f"grass type: {grass_type}",
        f"watering interval: {watering_interval}",
        f"watering rate: {watering_rate}",
        f"mowing interval: {mowing_interval}",
    ]

    return (
        # TODO: use hard coded prompt and then follow with recommendation
        "Yard Facts: \n- " + "\n-".join(facts) + "\n\n"
        """Categories: 
        1. Watering (frequency, amount per week, amount per session, ideal time to water, etc.)
        2. Tools/Equipment (rakes, seed spreader, rotary mower vs reel mower, etc.)
        3. Common Lawn Problems (weeds, lawn diseases, bugs, etc.)
        4. Mowing (cutting height, frequency, equipment care, etc.)
        5. Fertilizing (rate, frequency, NPK meaning, indicators of ,etc.)
        6. Aerating (depth, types, frequency, indicators of compacted soil, etc.)
        7. Dethatching (frequency, dethatching vs scarifying, manual vs powered, etc.)
        """
        "Task for Hero: For each category above, provide a 3-4 sentence recommendation using the provided 'Yard Facts'."
        "Base your recommendation on the 'Yard Facts' provided above - supplemented by location based soil, grass, and climate data gathered from the provided zip code."
        "Do not constantly repeat the users zip-code, it appears repetetive."
        "If 'grass type' or 'soil type' are 'Unknown', use the predominant type for that area."
        "The recommendations should give a general idea of the tasks and things to look out for for the entire year instead of season specific."
        "If there are any high importance tasks that must be done at a specific time of year, briefly mention those but refrain from focusing the entire recommendation on just one season."
        "No markdown. No specific tool manufacturers."
    )

def parse_supertips(text: str) -> dict:
    # Normalize whitespace/newlines
    t = (text or "").replace("\r\n", "\n").replace("\r", "\n").strip()

    # Regex matches headers like "Watering:" or "Tools/Equipment:" with optional inline content
    header_re = re.compile(r"(?mi)^(?:\d+\.\s*)?([A-Za-z/ ]+)\s*:\s*(.*)")

    def to_key(label: str) -> str | None:
        label = (label or "").strip().lower()
        mapping = {
            "watering": "watering",
            "tools/equipment": "tools",
            "tools": "tools",
            "common lawn problems": "yard_problems",
            "lawn problems": "yard_problems",
            "problems": "yard_problems",
            "mowing": "mowing",
            "fertilizing": "fertilizing",
            "aerating": "aerating",
            "dethatching": "dethatching",
        }
        return mapping.get(label)

    # Initialize result with empty strings to satisfy model fields
    result = {
        "watering": "",
        "tools": "",
        "yard_problems": "",
        "mowing": "",
        "fertilizing": "",
        "aerating": "",
        "dethatching": "",
    }

    # Find all headers
    matches = list(header_re.finditer(t))
    if not matches:
        return result  # Nothing matched; return empties

    for i, m in enumerate(matches):
        label = m.group(1)
        key = to_key(label)
        
        # Capture inline content after colon
        inline_text = m.group(2).strip()
        
        # Capture everything until the next header
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(t)
        remaining_text = t[start:end].strip()
        
        # Combine inline text and remaining text
        content = (inline_text + " " + remaining_text).strip()
        
        # Collapse multiple newlines
        content = re.sub(r"\n{2,}", "\n\n", content)

        if key:
            result[key] = content

    return result

