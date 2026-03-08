build helio, a platform that, given just a home address as input, provides detailed report of the effectiveness of solar panels
doing this for a sustainability track for a hackathon, aiming to break the barriers of entry into effective solar panel usage for homes. Helio should take in just a home address as input, and utilize a variety of necessary APIs to output a comprehensive multi-step report through the website that gives the user information about:
	•	environmental impact should be the focus throughout this project to emphasize the sustainability track (quantified in carbon reduction, electricity saved, etc)
	•	usable roof area
	•	annual sunshine hours received for that house, seasonally as well
	•	roof orientation (if relevant)
	•	estimated shading loss
	•	electricity rate - how much you’re being charged for electricity currently
	•	annual usage estimate
	•	and, based on the above, a solar suitability score on a scale from 1 - 10 that calculates how effective the installation of solar panels on your roof would be
	•	also, a map that shows the property location from satellite imagery on a map
	•	panel types for solar panels based on location, roof size, etc. (get the satellite imagery to help calculate the roof size)
	•	how many panels the user should install based on roof size
	•	then, a simulation with toggles that uses the above two to determine how prices change, and how the environmental impacts change
	•	a list of a few local solar installers with their ratings and specific reviews based on the kind of solar panels needed to be installed, and other relevant information
	•	lastly, generate an action plan to summarize all this info and give the user actionable steps
API Nominatim (OpenStreetMap) Convert street address → lat/lon coordinates + extract state Overpass API (OpenStreetMap) Two calls: (1) fetch building polygon at the address → real roof area + orientation; (2) find solar businesses within 50km for installer matching PVGIS (EU Joint Research Centre) Two calls: (1) annual solar irradiance yield (kWh/kWp) for the exact coordinates; (2) horizon profile scan → real terrain/building shading loss % NREL URDB (National Renewable Energy Lab) Look up local utility electricity rate ($/kWh) by coordinates OpenStreetMap Tiles (via Leaflet) Render the interactive map on Step 2 Anthropic Claude API (via Express proxy) Two calls: (1) evaluate the 3 installers for this specific homeowner; (2) generate a 6-step personalized action plan
add visual elements and infographics to make ti visually appealing. make the color scheme visually appealing and the UI interactive and interesting as well.