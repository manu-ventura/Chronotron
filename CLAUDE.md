---
title: '#claude.md'
created: '2025-07-17T01:33:20.109Z'
modified: '2025-07-17T01:33:29.345Z'
---

#claude.md

This document provides a comprehensive guide for coding the Chronotron project, a 2D puzzle-platformer centered on time manipulation and cooperative puzzle-solving with past selves ("Echoes"). Informed by advanced game theory and temporal physics principles, these guidelines ensure consistent, robust, and paradox-aware implementation. The document is derived from the Chronotron Product Requirements Document (PRD) dated July 16, 2025.
Project Vision
Chronotron is a temporal paradox sandbox where players create and interact with Echoes to solve intricate environmental puzzles. The game evolves from a simple time-replay mechanic into a playable exploration of causality, bootstrap paradoxes, and closed time-like curves. It targets fans of high-concept puzzle games (e.g., Portal, Braid) and players with ADHD, leveraging low-stakes trial-and-error and hyperfocus-inducing complexity for massive dopamine payoffs.
Coding Principles
1. Technology Stack

Primary Language: Use HTML5, JavaScript, and p5.js for a browser-based implementation to ensure accessibility and compatibility.
Execution Environment: Ensure code runs in browsers via CDN-hosted libraries (e.g., p5.js from cdn.jsdelivr.net). If Python is used, leverage Pyodide for browser compatibility.
Constraints: Avoid local file I/O and network calls to maintain a sandboxed environment. Structure game loops to prevent infinite loops in browsers (e.g., use requestAnimationFrame for JavaScript or Pyodide’s asyncio for Python).

2. Core Gameplay Loop
Implement the Observe-Act-Time-Jump-Cooperate-Iterate loop, grounded in game-theoretic principles of iterative decision-making and temporal coordination:

Observe: Render the puzzle environment with clear visual cues for interactive objects, minimizing cognitive load for strategic planning.
Act: Record player inputs (position, velocity, interactions) in a deterministic, frame-accurate timeline for Echo replay.
Time-Jump: Reset the level to its initial state and spawn an Echo replaying the previous loop’s actions.
Cooperate: Enable the player to interact with Echoes (e.g., using an Echo’s position to activate a switch or block a hazard).
Iterate: Support multiple Echoes (3–5 per level) to create layered, cooperative solutions, optimizing for elegant strategies over brute force.

3. Temporal Physics Engine
The engine simulates a causal framework inspired by closed time-like curves and paradox resolution, ensuring consistency in temporal mechanics:

Echo Limit: Cap concurrent Echoes at 3–5 per level, configurable via a level-specific parameter. Use a stack-based data structure to manage Echo timelines.
Temporal Decay: Model older Echoes with visual and functional degradation:
Visual: Increase transparency (e.g., alpha = 1 - 0.2 * echo_age) and add scan-line effects for older Echoes.
Functional: Introduce minor input inaccuracies (e.g., ±1–2 pixel offsets for position or ±0.1s for timing) to simulate entropy in older timelines.


Bootstrap Paradox: Implement "Temporal Conveyors" as objects that transfer items (e.g., keys) to prior timelines. Ensure consistency via a global event log tracking object states across loops.
Grandfather Paradox: Detect interference with an Echo’s critical actions (e.g., blocking a path required for a recorded jump). Trigger a "Paradox Cascade" with:
Visual feedback: Screen glitches (e.g., shader-based distortion, chromatic aberration).
Mechanics: Immediate timeline reset to the start of the current loop.


Causal Hotspots: Design areas where actions propagate across all timelines (e.g., a switch toggles a door state for all Echoes). Use a global state machine to synchronize hotspot effects.

4. Player Mechanics
The player controls a "Chrononaut" with mechanics designed for precise control and strategic depth:

Core Movement: Implement tight platforming physics (e.g., velocity-based movement, collision detection with pixel-perfect accuracy). Ensure responsiveness (e.g., <16ms input latency).
Time-Jump: Bind to a key (e.g., T) or button. Reset level state (except persistent objects like Temporal Conveyors) and spawn a new Echo using the recorded action log.
Temporal Shield: Add a limited-use ability (1–2 uses per level, 3-second duration) to project a stationary shield. Use collision detection to protect Echoes from hazards (e.g., lasers, falling objects).
Causal Ping: Implement a visual pulse (e.g., radial gradient effect) highlighting interactive objects, color-coded by temporal properties:
Blue: Standard objects (e.g., switches, platforms).
Gold: Time-travel objects (e.g., Temporal Conveyors, Quantum Blocks).



5. Level Design
Structure levels as "causality test chambers" to explore specific temporal concepts, informed by game theory’s focus on equilibrium and paradox:

World 1 (Causality Basics): Teach Echo cooperation (e.g., one Echo holds a switch while another passes a door).
World 2 (Bootstrap Principles): Focus on Temporal Conveyors to send objects to past selves, creating self-referential loops.
World 3 (Paradox Avoidance): Design dense hazard fields requiring precise Echo choreography to avoid interference.
World 4 (Closed Time-Like Curves): Create puzzles with no clear start/end, where the solution is a self-sustaining loop (e.g., an Echo delivers a key that enables its own delivery).
World 5 (Quantum Superposition): Introduce "Quantum Blocks" that exist in all possible positions until observed by an Echo, locking their state for all timelines (inspired by quantum measurement principles).
Ensure levels reset cleanly to initial states, preserving only intentional temporal carryovers.

6. Art and Sound

Visuals:
Adopt a minimalist "test chamber" aesthetic: grid-based backgrounds, clean lines, and high-contrast colors for clarity.
Differentiate Echoes:
Most recent: Solid color (e.g., RGB(255, 100, 100)).
Second-oldest: 20% transparency (e.g., alpha = 0.8).
Older: Scan-line shader effect with 40%+ transparency.


Use bright colors for interactive objects (e.g., neon blue for switches, gold for Temporal Conveyors).


Sound:
Time-Jump: Distinct whoosh or rewind sound (e.g., 0.5s audio clip).
Active Echoes: Subtle, looping hum (e.g., low-frequency sine wave).
Paradox Risk: Sharp, electrical crackle when nearing interference (e.g., 0.2s burst, increasing pitch with proximity).
Puzzle Solved: Resonant chime (e.g., harmonic major chord) for dopamine release.
Soundtrack: Minimalist synth ambient during puzzles, swelling to orchestral tones at resolution.



7. Narrative Integration

Embed storytelling via environmental design (e.g., test chamber layouts suggesting instability) and collectible data logs (text objects with scientist notes).
Support a narrative arc where player actions trigger and resolve a large-scale temporal anomaly. Use level progression to reveal increasing instability (e.g., visual glitches in later levels).
Theme: Explore the question, "If you could control your past, would you master it or be its prisoner?" via subtle environmental cues and log content.

8. Game-Theoretic and Physics Considerations

Causality and Equilibrium: Model the game as a cooperative game where the player and Echoes form a coalition to achieve a Nash equilibrium (optimal puzzle solution). Ensure Echo actions are fixed to maintain deterministic outcomes.
Paradox Resolution: Implement paradox detection as a constraint satisfaction problem, checking for violations in Echo action dependencies (e.g., blocking a required jump). Reset timelines to enforce consistency.
Temporal Decay: Simulate entropy in older Echoes using stochastic perturbations (e.g., Gaussian noise on position/inputs), reflecting real-world degradation in closed time-like curves.
Quantum Mechanics: For World 5, model Quantum Blocks using a simplified superposition state (array of possible positions) that collapses to a single state upon Echo observation, inspired by quantum measurement.

9. Success Metrics

Technical: Achieve high level-completion rates with low crash rates. Ensure Paradox Cascade triggers only on valid interference.
Player Engagement: Monitor community metrics (e.g., solution videos, forum discussions, speed-running with minimal Echoes/time).
Qualitative: Prioritize code that enables "aha!" moments (e.g., elegant bootstrap paradox solutions) and minimizes frustration (e.g., clear feedback on paradox triggers).

10. Implementation Notes

Data Structures:
Use a timeline array to store Echo actions (e.g., [{frame: 1, x: 100, y: 200, action: "jump"}, ...]).
Maintain a global state for persistent objects (e.g., Temporal Conveyor inventory).


Optimization:
Cap frame rate at 60 FPS using requestAnimationFrame or Pyodide’s asyncio.sleep(1/60).
Optimize collision detection for multiple Echoes using spatial partitioning (e.g., quadtrees).


Testing:
Unit-test paradox detection to ensure false positives are minimized.
Playtest levels for ADHD accessibility (e.g., instant resets, clear feedback).


Extensibility: Design modular level scripts to allow easy addition of new temporal mechanics (e.g., future worlds with parallel timelines).

