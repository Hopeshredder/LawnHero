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
        "If 'grass type' or 'soil type' are 'Unknown', use the predominant type for that area."
        "The recommendations should give a general idea of the tasks and things to look out for for the entire year instead of season specific."
        "If there are any high importance tasks that must be done at a specific time of year, briefly mention those but refrain from focusing the entire recommendation on just one season."
        "No markdown. No specific tool manufacturers."
    )
