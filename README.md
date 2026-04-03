# 🎸 Soundprint of the 2000s: Audio Analytics Dashboard

### Subject: Emotional and Technical Analysis of 2000s Rock via Spotify Data

This project was developed as a term project for the **Data Visualization (2026)** course.

**Author:** Illia Khurtak, **UCU Data Science** Program.

**Instructor:** [Yevheniya Drozdova](https://www.facebook.com/drozdova.e.a/)).

---

## 📌 Project Overview
This interactive dashboard explores the musical characteristics of four iconic bands from the 2000s: **My Chemical Romance**, **Blink-182**, **Sum 41**, and **Coldplay**. Using advanced data visualization techniques, the project tracks the evolution of the genre—from aggressive pop-punk energy to the atmospheric melancholy of alternative rock.

### Key Visual Insights:
* **Emotional Spectrum:** Comparing "Mood" (Valence) vs. "Energy" levels.
* **Technical Sound:** Analyzing "Danceability" vs. "Acousticness" (electronic vs. raw instruments).
* **Popularity Trends:** Visualizing how the popularity of tracks persists over their release years.

---

## 🛠 Tech Stack
* **D3.js (v7)** – Primary library for building interactive SVG-based charts.
* **HTML5 / CSS3 (Glassmorphism UI)** – A modern, dark-themed interface with neon accents and backdrop filters.
* **JavaScript (ES6+)** – Real-time data filtering and interaction logic.
* **Python (Pandas)** – Data pre-processing and dataset optimization.

---

## 📊 Data Source
The visualization is powered by an open-source Spotify dataset containing over 160,000 tracks.
* **Source:** [Spotify Dataset 1921-2020 (Kaggle)](https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-1921-2020-160k-tracks)
* **Download Method:** `kagglehub.dataset_download("yamaerenay/spotify-dataset-1921-2020-160k-tracks")`

### Optimization (Data Engineering):
To ensure high performance and instant loading, the original ~25 MB dataset was pre-processed using the `filter_data.py` script. This reduced the data to 284 essential rows, resulting in a lightweight `tracks_light.csv` file for the web application.

---

## 🚀 Dashboard Features
1.  **Interactive Legend:** Toggle specific artists on/off to isolate and compare data clusters.
2.  **Focus Mode:** Hovering over a data point dims all other elements to reduce cognitive load and highlight specific song details.
3.  **Neon Glow UI:** Custom SVG filters applied to data points to simulate a "Rock Concert" atmosphere.
4.  **Responsive Design:** Flexible layout that adapts to different screen sizes.

---

## 🔧 Local Setup
1.  Clone the repository:
    ```bash
    git clone [https://github.com/illiakhurtak/spotify-data-viz.git](https://github.com/illiakhurtak/spotify-data-viz.git)
    ```
2.  Open the project folder in VS Code.
3.  Launch `index.html` using the **Live Server** extension.

---

## 🏫 UCU | Data Science 2026
This project was completed as part of the curriculum at the **Ukrainian Catholic University**.
