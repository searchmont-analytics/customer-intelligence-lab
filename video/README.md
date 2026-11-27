# Video production package
This directory is the pre-production source for the flagship site's approximately four-minute executive explainer.

- [Narration and presenter script](script.md) — complete draft for three real presenter takes and five narrator takes.
- [Storyboard and edit plan](storyboard.md) — time-coded visual treatment, capture checklist, recording notes and publishing copy.

Suggested incoming asset structure (keep raw media private until approved):
```
video/
  media/             # local only: do not commit raw personal recordings
    presenter/
      scene-01-opening.mp4
      scene-05-judgment.mp4
      scene-08-closing.mp4
    narration/
      scene-02-business-question.wav
      scene-03-research-rigour.wav
      scene-04-intelligence.wav
      scene-06-investment.wav
      scene-07-leadership.wav
    screen-captures/
    music/
  output/            # rendered exports, local until approved
```
Use normalized WAV for narration (48 kHz, mono or stereo), and retain original recordings. The existing static HTML application is unchanged by this package. Do not embed an unfinished video or use a placeholder player in the website. Next production gate: record presenter takes and approve narration/visual direction, then build and time the edit against the actual audio. No video has been rendered.
