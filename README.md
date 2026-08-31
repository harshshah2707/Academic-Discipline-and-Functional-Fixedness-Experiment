# Academic Discipline, Stimulus Modality, and Functional Fixedness

A web-based cognitive psychology experiment platform investigating whether academic background (Fine Arts vs. History) and stimulus presentation modality (Picture vs. Word) influence functional fixedness, representational flexibility, and alternative-use fluency.

---

## 🎯 Study Design

The experiment implements a **2 × 2 Factorial Between-Subjects Design**:

- **Independent Variable 1 (Participant Characteristic):** Academic Discipline
  - Group 1: Fine Arts / Visual Arts students
  - Group 2: History students
  - *(Other academic disciplines are collected for secondary exploratory analysis)*
- **Independent Variable 2 (Manipulated Modality):** Stimulus Presentation
  - Condition A: **Picture Condition** (visual neutral rendering only, no written name)
  - Condition B: **Word Condition** (large written text only, no image)
  - *Stratified random assignment ensures balanced cell sizes across disciplines.*
- **Primary Dependent Variable:** **Functional Fixedness**
  - Operationalised as response latency to submit the first valid alternative use of a familiar object.
  - Measured with sub-millisecond precision using `performance.now()`.
- **Secondary Dependent Variable:** **Representational Flexibility**
  - Participant's exact raw response preserved for qualitative researcher coding (semantic/conventional vs. structural/perceptual).
- **Additional Dependent Variable:** **Alternative-Use Fluency**
  - 60-second timed fluency phase recording each additional alternative use and individual latency.

---

## 🧪 Experimental Flow

1. **Welcome Page:** Title *"Thinking About Everyday Objects"*
2. **Informed Consent:** University-grade voluntary participation form
3. **Demographics:** Age (≥18 check), Academic discipline, Study level, Formal visual arts training, Creative activity frequency
4. **Stratified Random Assignment:** Balanced allocation to Picture or Word condition
5. **Standardised Instructions:** Task guidance for first and additional alternative uses
6. **Practice Trial:** Single practice object (`COIN`)
7. **Main Experimental Trials:** 6 randomised everyday objects (`PAPERCLIP`, `BRICK`, `NEWSPAPER`, `SPOON`, `CUP`, `RUBBER BAND`)
   - Phase 1: Fixation Screen (`+` symbol, 500 ms)
   - Phase 2: Stimulus Presentation (Picture or Word only, 2.0 s)
   - Phase 3: Conventional Function Statement (2.5 s, toggleable)
   - Phase 4: First Alternative Use (High-precision response latency recording)
   - Phase 5: Additional Uses Phase (60-second countdown fluency task)
8. **Midpoint Rest Break:** Brief pause after trial 3 of 6
9. **Post-Experiment Questionnaire:** Instruction understanding, technical issues, prior knowledge of functional fixedness, external AI help
10. **Debriefing & Completion:** Neutral scientific explanation and anonymous Participant ID verification (`P0001`...)

---

## 📊 Live Google Sheets Real-Time Sync & CSV Exports

All participant responses, millisecond-precision latencies, and trial records stream directly into Google Sheets and can be exported as 3 distinct CSV datasets:
- **Dataset 1:** Participant Level (`dataset_1_participant_level.csv`)
- **Dataset 2:** Trial Level (`dataset_2_trial_level.csv`)
- **Dataset 3:** Response Level (`dataset_3_response_level.csv`)

---

## 🔒 Researcher Administration Portal

Access the built-in control center by clicking **Researcher Access** in the top right header (Default password: `researcher2026`):
- **2 × 2 Allocation Matrix:** Real-time group balance monitor
- **Latency Analytics:** Mean first-response latencies and fluency counts by condition
- **Participants Table:** Exclude/include toggles and session records
- **Trial & Qualitative Response Inspector:** Automated flagging system for empty, ultra-short (<3 chars), or conventional repetitions
- **Object & Timing Configurator:** Add/edit stimuli and customize phase durations
- **Google Sheets Sync Hub:** Direct Webhook configuration and one-click full data push

---

## 🚀 Tech Stack & Setup

- **Framework:** React 19 + Vite 8
- **Styling:** TailwindCSS v4 + Academic UI Design System
- **Icons:** Lucide React
- **Hosting:** Vercel

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```
