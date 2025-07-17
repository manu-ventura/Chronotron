# Chronotron Coding Standards

## General Principles
- Use JavaScript with p5.js for game logic and rendering.
- Ensure code runs in browsers via CDN-hosted libraries.
- Avoid local file I/O and network calls.
- Structure game loops to prevent infinite loops (use requestAnimationFrame).

## Style Guidelines
- Follow ESLint rules as configured in .eslintrc.json.
- Use 2-space indentation.
- Use single quotes for strings.
- Always end statements with semicolons.
- Warn on console logs.

## Best Practices
- Implement deterministic, frame-accurate timelines for Echoes.
- Optimize for 60 FPS.
- Use modular design for level scripts and mechanics. 