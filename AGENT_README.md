# Agent Development Guide - Chronotron

## Welcome to Chronotron Development!

You are working on Chronotron, a 2 puzzle-platformer with time manipulation mechanics. This guide will help you understand the project status and continue development effectively.

## Project Status Overview

**Current Phase:** Milestone 1totype (2-3onths)  
**Goal:** Build a functional prototype with core gameplay loop and one test level  
**Progress:** ~60ete - Core systems implemented, needs level design and audio

## Key Files to Monitor

### 📊 Progress Tracking
- `AGENT_PROGRESS_TRACKER.md` - Comprehensive project status and milestone tracking
- `DAILY_PROGRESS_LOG.md` - Daily work log and accomplishments
- `AGENT_CHECKLIST.md` - Systematic checklist for development tasks

### 📋 Project Documentation
- `TASKS.md` - Detailed task breakdown by milestone
- `PLANNING.md` - Project architecture and technology stack
- `CLAUDE.md` - Coding guidelines and implementation notes

### 🎮 Source Code
- `src/game/` - Core game systems
- `src/main.js` - Entry point
- `package.json` - Dependencies and scripts

## Current Implementation Status

### ✅ Completed Systems
- Game loop manager (60 FPS)
- Input system with frame-accurate recording
- Player movement and collision
- Echo (past self) replay system
- Basic paradox detection
- Time-Jump mechanics

### 🔧 Current Issues
1. **Critical:** Syntax errors in Game.js need fixing
2al:** Dependencies not installed (`npm install` needed)
3**High Priority:** Level rendering not implemented
4**High Priority:** Audio system not integrated

## Your Development Workflow

###1 Daily Startup
```bash
# Check current status
git status
npm install  # If dependencies missing
npm test     # Ensure tests pass
```

### 2. Follow the Checklist
- Open `AGENT_CHECKLIST.md`
- Work through Priority 1 items first (critical issues)
- Then move to Priority 2 (feature completion)

### 3. Update Progress
- Update `DAILY_PROGRESS_LOG.md` with your work
- Mark completed items in `AGENT_PROGRESS_TRACKER.md`
- Commit your changes regularly

## Immediate Next Steps (Priority Order)

### 1. Fix Critical Issues
- Run `npm install` to install dependencies
- Fix syntax errors in Game.js
- Ensure all tests pass

### 2. Complete Milestone 1
- Implement level loading and rendering
- Add interactive objects (switches, doors)
- Integrate Howler.js audio system
- Create first test level

### 3. Begin Milestone 2
- Implement Temporal Conveyor mechanics
- Add Causal Hotspot system
- Develop player abilities (Temporal Shield, Causal Ping)

## Development Principles

### Code Quality
- Follow ESLint rules
- Write tests for new features
- Maintain 60 FPS performance
- Document functions clearly

### Game Design
- Focus on ADHD accessibility (instant resets, clear feedback)
- Create "aha!" moments through elegant puzzle solutions
- Ensure paradox detection is accurate (<1 false positives)
- Build for community engagement

### Project Management
- Complete one milestone before moving to the next
- Document all major decisions
- Keep the game playable at all times
- Focus on working features over perfect code

## Success Metrics

### Technical
- >95% level-completion rates
- <5% crash rates
- 60 FPS performance
- <1% paradox detection false positives

### Player Experience
- Clear feedback for all actions
- Instant resets for trial-and-error
- Satisfying puzzle solutions
- Accessible for ADHD players

## Getting Help

If you encounter issues:
1. Check the documentation files first
2. Review the checklist for similar problems
3. Document the issue in the daily log
4. Focus on getting a minimal working version5 Dont hesitate to refactor if needed

## Remember

- **The goal is a complete, playable game**
- **Focus on working features over perfect code initially**
- **Keep the player experience in mind**
- **Document your progress regularly**
- **Test frequently**

Good luck with the development! The temporal paradox sandbox awaits your implementation.

---
**Last Updated:** July1725 
**Next Review:** After each major milestone completion