# Velora — The Story Never Ends

Velora is a cinematic memory-keeping web application that transforms personal memories into a visual universe of stars.

Every memory becomes a star, and memories can form constellations based on their categories and importance.

## ✨ Features

- 🌌 Interactive cosmic memory universe
- ⭐ Memories represented as stars
- 🗓️ Timeline-based memory navigation
- 🚀 Cinematic time-travel effect between years
- ✨ Memory constellations based on categories
- 📸 Add photos to memories
- 🎥 Add videos to memories
- ✏️ Edit existing memories
- 🗑️ Delete memories
- 📅 "On This Day" memory discovery
- 💾 Local memory storage using IndexedDB
- 🌠 Animated cosmic background
- 🔭 Live NASA data through a REST API
- 📱 Responsive design for different screen sizes

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- TypeScript
- React
- Next.js
- Tailwind CSS
- IndexedDB
- REST API
- Git & GitHub

## 🌌 How Velora Works

The core idea of Velora is:

LIVE A MOMENT  
↓  
SAVE IT  
↓  
IT BECOMES A STAR  
↓  
STARS FORM CONSTELLATIONS  
↓  
TIME PASSES  
↓  
VELORA BRINGS YOU BACK  
↓  
RELIVE THE STORY

Each memory contains information such as:

- Title
- Date
- Description
- Category
- Importance
- Optional image
- Optional video

The memory's category determines its visual color, while its importance affects its appearance in the universe.

## 💾 Data Storage

Velora currently uses the browser's **IndexedDB API** to store memories locally.

This allows memories to remain available in the user's browser without requiring a separate database server.

## 🔭 NASA REST API

Velora also demonstrates live REST API integration using NASA's Image and Video Library API.

The application uses:

- `fetch()`
- `async/await`
- JSON responses
- Dynamic DOM rendering

NASA imagery is displayed in the **Cosmic Discovery** section of Velora.

API endpoint used:

```text
https://images-api.nasa.gov/search?q=galaxy&media_type=image 