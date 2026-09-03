# Academic Discipline, Stimulus Modality, and Functional Fixedness: An Exploratory Study of Fine Arts and Commerce Students

A complete, functional, browser-based online cognitive psychology research experiment investigating whether students from different academic disciplines (Fine Arts vs. Commerce) differ in how they generate alternative uses for familiar objects, and whether this differs depending on how the object is presented (Picture Condition vs. Word Condition).

---

## 🎯 2 × 2 Factorial Experimental Design

1. **Independent Variable 1 (Naturally Occurring Participant Characteristic):** Academic Discipline
   - **Fine Arts**
   - **Commerce**
   - *(Other academic disciplines are also supported for exploratory comparison)*
2. **Independent Variable 2 (Manipulated Stimulus Presentation):** Stimulus Modality
   - **Picture Condition:** Objects are presented as clear, neutral visual drawings/illustrations on a plain background without written text.
   - **Word Condition:** Objects are presented only as large, clear written object names (e.g. `PAPERCLIP`, `BRICK`, `SPOON`, `RUBBER BAND`, `NEWSPAPER`, `CUP`) without visual images.
   - *Participants can experience either automatic balanced random assignment or manual modality selection.*

### Four Experimental Groups:
1. Fine Arts + Picture
2. Fine Arts + Word
3. Commerce + Picture
4. Commerce + Word

---

## ⚡ Mentor Demo Mode (Interactive Showcase)

For demonstrating the experiment to your mentor, supervisor, or research committee:
- Click the glowing **Demo Mode** button in the header at any time.
- **Section Jumper:** Jump immediately to any of the 11 experiment stages:
  1. `Welcome Screen`
  2. `Demographic Questionnaire`
  3. `Informed Consent Form` (with 4 mandatory declarations)
  4. `Modality Selection` (Picture vs. Word preview)
  5. `Standardised Instructions`
  6. `Practice Trial` (Button stimulus)
  7. `Main Trials 1–6` (Paperclip, Brick, Newspaper, Spoon, Cup, Rubber Band)
  8. `Mid-Task Rest Break`
  9. `Final Questionnaire` (Object Familiarity 1–5 ratings & Cognitive Strategy)
  10. `Debriefing Statement`
  11. `Data Download & Export`
- **Live Modality Switcher:** Toggle between **Picture** and **Word** format with 1 click to show your mentor both visual stimuli and textual presentations side-by-side.
- **Fill & Run Trial:** Instantly fills sample demographic data and jumps directly into Trial 1.
- **Insert Demo Uses:** Populates realistic sample alternative uses to showcase the dynamic response list and countdown timer.

---

## 🧪 Experimental Flow & Trial Structure

1. **Screen 1: Welcome:** Participant-facing introduction explaining the task and device recommendations.
2. **Screen 2: Demographic Information:**
   - Anonymous Participant ID (auto-generated)
   - Age (numeric, 18+)
   - Gender (Woman, Man, Non-binary, Prefer not to say, Prefer to self-describe)
   - Academic Discipline (Fine Arts / Commerce / Other)
   - Year of Study (First Year, Second Year, Third Year, Fourth Year, Postgraduate, Other)
   - Previous formal visual arts training & years of training
3. **Screen 3: Informed Consent:**
   - 4 required checkboxes (Age 18+, Voluntary, Right to withdraw, Consent declaration)
   - Continue button remains disabled until all 4 boxes are checked.
4. **Screen 4: Modality Selection / Random Assignment:** Assigns or allows selecting Picture or Word format.
5. **Screen 5: Standardised Instructions:** Standardised instructions for Phase 1 (first alternative use) and Phase 2 (fluency).
6. **Screen 6: Practice Trial:** Practice object (`BUTTON` / `COIN`) to familiarize participants with the layout.
7. **Screen 7: Main Experimental Trials (6 Familiar Objects):**
   - Objects: **Paperclip**, **Brick**, **Spoon**, **Rubber Band**, **Newspaper**, **Cup**
   - Randomised presentation order separately for every participant.
   - **Phase 1 (First Alternative Use):** Measures initial response latency in milliseconds using `performance.now()` from the exact moment the stimulus is rendered until submission.
   - **Phase 2 (Creative Ideation / Additional Uses):** 60-second visible countdown timer with dynamic, immutable response list.
8. **Screen 8: Mid-Task Break Screen:** Brief restorative break after trial 3 of 6.
9. **Screen 9: Final Questionnaire:**
   - **Familiarity Ratings:** 5-point scale (1 = Not at all familiar to 5 = Extremely familiar) for all 6 objects.
   - **Technical Problems:** Checkbox and optional description.
   - **Cognitive Strategy:** Open-ended question on strategies used during ideation.
10. **Screen 10: Study Debriefing:** Neutral debriefing on functional fixedness and object representations.
11. **Screen 11: Data Download & Completion:** Instant one-click CSV export and participant verification.

---

## 📊 Data Export & Qualitative Coding Schema

The platform exports structured CSV files ready for statistical analysis in R, SPSS, Jamovi, or Python:
1. **`participant_data.csv`** (Dataset 1: One row per participant)
2. **`trial_data.csv`** (Dataset 2: One row per participant per object trial)
3. **`response_data.csv`** (Dataset 3: One row per individual generated response)

### Pre-formatted Qualitative Coding Columns:
To facilitate double-blind coding by two independent researchers, the exported dataset contains empty columns ready for classification:
- `response_validity`
- `response_type`
- `canonical_related`
- `property_based`
- `novelty_rating`
- `coder_1`
- `coder_2`

---

## 🔒 Researcher Admin Portal

Click **Researcher Access** in the top header (Default password: `researcher2026`):
- **2 × 2 Allocation Matrix:** Live participant counts across Fine Arts/Commerce × Picture/Word.
- **Latency & Fluency Analytics:** Mean response times and response counts.
- **Live Data Tables:** Filter and inspect participant, trial, and response data.
- **Google Sheets Real-Time Sync:** Webhook integration for remote automated multi-participant data collection.

---

## 🖼️ Adding Custom Stimulus Images

Neutral SVG stimuli for all objects are included out of the box. To use custom photographic images:
1. Place image files into the `public/images/` directory:
   - `public/images/paperclip.jpg`
   - `public/images/brick.jpg`
   - `public/images/spoon.jpg`
   - `public/images/rubber-band.jpg`
   - `public/images/newspaper.jpg`
   - `public/images/cup.jpg`
   - `public/images/button.jpg`
2. Open the **Researcher Panel $\to$ Stimulus Objects** and enter `/images/<filename>.jpg` in the Image URL field.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in any modern web browser.

