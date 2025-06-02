```markdown
Follow these instructions to build a polished “hero” (main splash) section for Coach Mark’s fitness website, using the primary video file as the source of truth for all headline and subheading copy. Work iteratively via checkpoints.

---

### Principles to Guide Your Work

1. **Plan Before You Build**  
   • Leverage existing planning: the site’s structure focuses on Coach Mark’s customized weight‐loss program. Do not invent new requirements—follow what’s already outlined.

2. **Break Down Tasks & Build Iteratively**  
   • Complete one small, testable step at a time. After each step, wait for confirmation before moving on.

3. **Be Clear, Simple, and Direct**  
   • Use concise language. Frame commands as positive instructions (e.g., “Create an HTML file…”).

4. **Be Specific and Detailed**  
   • Respect given constraints: font sizes, overlay opacity, specific file names, and the fact that hero copy comes from Coach Mark’s video.

5. **Provide Relevant Context Only**  
   • Refer accurately to files: `fb120053-91e4-4395-b879-20f12cdf3406.mov`, `index.html`, `styles.css`. Avoid unnecessary details.

6. **Show Examples**  
   • Include small code snippets to illustrate structure (e.g., how to format `<section id="hero">`).

7. **Iterate & Refine**  
   • Expect feedback. Be prepared to adjust headlines, subheadings, or code if they don’t match Coach Mark’s tone.

8. **Ask for Guidance When Unsure**  
   • If needing clarification (e.g., video optimization or image fallback), pause and request instructions.

9. **Focus on “What,” Decide “How”**  
   • The goal is to display Coach Mark’s words correctly. Choose appropriate HTML/CSS techniques without over‐engineering.

10. **Prompt for Debugging if Errors Arise**  
    • If any code generates errors or layout issues, provide exact error details and follow an Explain → Document → Fix workflow.

---

## STEP 1: Load & Transcribe the Video
1. Locate the video file in the project root:  
   ```
   fb120053-91e4-4395-b879-20f12cdf3406.mov
   ```
2. Extract audio and run speech‐to‐text. Produce a verbatim transcript (including pauses, filler words, emphases) in a variable named `videoTranscript`.
3. Print the full `videoTranscript`, formatting each line with timestamps, for example:  
   ```
   [00:00:03] Mark: “Welcome, I’m Coach Mark. In this customized weight‐loss program…”
   ```
4. **Checkpoint 1**: After printing `videoTranscript`, pause and wait for confirmation before continuing.

---

## STEP 2: Identify Core Messaging
1. Review `videoTranscript`, focusing on Coach Mark’s explanation of his customized weight‐loss program:
   - Tone: motivational and empathetic
   - Key benefits: personalization, accountability, results
2. Extract the following three pieces of copy, using Coach Mark’s exact words when possible:
   ```js
   heroHeadline = "…"        // One punchy sentence capturing the main promise
   heroSubheading = "…"      // Two or three sentences elaborating the promise
   heroCTA = "…"             // Short call‐to‐action phrase (e.g., “Start Your Transformation”)
   ```
3. Print those three variables exactly as shown.
4. **Checkpoint 2**: After listing `heroHeadline`, `heroSubheading`, and `heroCTA`, pause for review.

---

## STEP 3: Design Hero Section Structure (HTML)
1. Create a file named `index.html` in the project root. In the `<body>`, add a `<section id="hero">` containing:
   ```html
   <section id="hero">
     <!-- Full‐screen background video -->
     <video
       class="hero-background"
       src="fb120053-91e4-4395-b879-20f12cdf3406.mov"
       autoplay
       muted
       loop
       playsinline
     ></video>
     <!-- If using a static image fallback, replace the <video> above with:
     <div class="hero-background" style="background-image: url('YOUR_IMAGE_URL');"></div>
     -->

     <!-- Semi‐transparent overlay -->
     <div class="overlay"></div>

     <!-- Centered content container -->
     <div class="hero-content">
       <h1 id="hero-headline">REPLACE_WITH_heroHeadline</h1>
       <p id="hero-subheading">REPLACE_WITH_heroSubheading</p>
       <a href="#signup" class="cta-button" aria-label="REPLACE_WITH_heroCTA">
         REPLACE_WITH_heroCTA
       </a>
       <div class="scroll-arrow" aria-hidden="true">↓</div>
     </div>

     <!-- Hidden full transcript for SEO/accessibility -->
     <div id="full-transcript" style="display:none;">{{ videoTranscript }}</div>
   </section>
   ```
2. In the `<head>` of `index.html`, include:
   ```html
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <!-- Meta description: one‐sentence summary from Coach Mark’s transcript -->
   <meta 
     name="description" 
     content="REPLACE_WITH_ONE_SENTENCE_SUMMARY" 
   />
   <title>Coach Mark’s Customized Weight‐Loss Program</title>
   <link rel="stylesheet" href="styles.css" />
   ```
3. **Checkpoint 3**: Print the first 50 lines of `index.html` (showing placeholders) and then pause for confirmation.

---

## STEP 4: Create & Style CSS (styles.css)
1. Create a file named `styles.css` in the project root. Add the following styles:
   ```css
   /* 4.1) RESET & FONT */
   body {
     margin: 0;
     font-family: 'Roboto', sans-serif;
   }

   /* 4.2) HERO CONTAINER: FULL SCREEN, CENTER CONTENT */
   #hero {
     position: relative;
     width: 100%;
     height: 100vh;
     overflow: hidden;
     display: flex;
     align-items: center;
     justify-content: center;
   }

   /* 4.3) BACKGROUND VIDEO/IMAGE */
   .hero-background {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     object-fit: cover; /* Ensure it covers the entire area */
     z-index: 1;
   }

   /* 4.4) SEMI-TRANSPARENT OVERLAY */
   .overlay {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, 0.5); /* 50% black overlay */
     z-index: 2;
   }

   /* 4.5) HERO TEXT & CTA: CENTERED, WHITE TEXT */
   .hero-content {
     position: relative;
     z-index: 3;
     text-align: center;
     color: #ffffff;
     padding: 0 1rem;
     display: flex;
     flex-direction: column;
     align-items: center;
   }
   #hero-headline {
     font-size: 3rem; /* Desktop default */
     margin: 0;
     line-height: 1.2;
   }
   #hero-subheading {
     font-size: 1.25rem;
     font-weight: 300;
     margin: 1rem 0 2rem 0;
     max-width: 800px;
     line-height: 1.5;
   }
   .cta-button {
     display: inline-block;
     background-color: #FF6F61; /* Accent color */
     color: #ffffff;
     text-decoration: none;
     font-size: 1.125rem;
     padding: 1rem 2rem;
     border-radius: 8px;
     transition: background-color 0.3s ease;
   }
   .cta-button:hover {
     background-color: #e65550; /* Slightly darker on hover */
   }

   /* 4.6) SCROLL ARROW ANIMATION */
   .scroll-arrow {
     margin-top: 2rem;
     font-size: 2rem;
     opacity: 0.7;
     animation: bounce 2s infinite;
   }
   @keyframes bounce {
     0%, 20%, 50%, 80%, 100% {
       transform: translateY(0);
     }
     40% {
       transform: translateY(10px);
     }
     60% {
       transform: translateY(5px);
     }
   }

   /* 4.7) RESPONSIVE MOBILE ADJUSTMENTS */
   @media (max-width: 600px) {
     #hero-headline {
       font-size: 2rem;
     }
     #hero-subheading {
       font-size: 1rem;
     }
     .cta-button {
       font-size: 1rem;
       padding: 0.75rem 1.5rem;
     }
   }
   ```
2. **Checkpoint 4**: Print the first 50 lines of `styles.css` and then pause for confirmation.

---

## STEP 5: Replace Placeholders & Finalize
1. **Swap in real copy**:
   - In `index.html`, replace `REPLACE_WITH_heroHeadline` with the exact value of `heroHeadline`.
   - Replace `REPLACE_WITH_heroSubheading` with `heroSubheading`.
   - Replace both occurrences of `REPLACE_WITH_heroCTA` (link text and `aria-label`) with `heroCTA`.
   - In `<meta name="description" content="…">`, replace `REPLACE_WITH_ONE_SENTENCE_SUMMARY` with a concise, one‐sentence summary drawn from the transcript.

2. **Embed transcript**:
   - Copy the full `videoTranscript` (with timestamps) into the hidden `<div id="full-transcript">`.
   ```html
   <div id="full-transcript" style="display:none;">
     [00:00:03] Mark: “Welcome, I’m Coach Mark. In this customized weight‐loss program…”
     …etc…
   </div>
   ```

3. **Verify video path**:
   - Ensure `<video class="hero-background" src="fb120053-91e4-4395-b879-20f12cdf3406.mov" …>` correctly references the video file in Replit.
   - If performance is a concern and you switch to a static image, use:
     ```html
     <div 
       class="hero-background" 
       style="background-image:url('YOUR_IMAGE_URL');"
       alt="Coach Mark demonstrating weight-loss program"
     ></div>
     ```

4. **Checkpoint 5: Live Preview & Testing**:
   - Run a live preview in Replit and confirm:
     1. Background video (or image) fills the viewport.
     2. The overlay is visible (semi‐transparent black).
     3. `heroHeadline`, `heroSubheading`, and CTA button appear centered, white, and styled correctly.
     4. The scroll arrow bounces gently.
     5. On screens ≤600 px wide, fonts and padding adjust appropriately.

5. **Final Check**:
   - Inspect page source to confirm `<div id="full-transcript">…</div>` contains the full transcript.
   - Confirm the meta description is set correctly.

---

### Final Notes
- After each checkpoint, wait for confirmation before proceeding.
- Preserve Coach Mark’s exact tone—no added marketing jargon.
- If any code errors occur, capture exact error messages and follow an Explain → Document → Fix workflow.
- If you need to add JS (e.g., smooth scroll), ask before implementing.

Begin with **STEP 1**: load and transcribe `fb120053-91e4-4395-b879-20f12cdf3406.mov`. Pause at “Checkpoint 1” until instructed to continue.
```