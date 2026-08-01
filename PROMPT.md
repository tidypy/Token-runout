Build a minimal AI token runway tracker UI for developers.

Style:
- Light, transparent, glassy widget look
- Not dark-mode first
- Floating widget mode
- Compact mode
- Clean, polished, unobtrusive
- Small, readable, modern

Goal:
Track live provider pricing and forecast when token budget will run out for each API/model added.

Required:
- Next.js + React + Tailwind + shadcn/ui style UI
- Live pricing per provider/model
- Mandatory forecasting for every API/model added
- Rolling burn-rate estimates (3d / 7d / 14d)
- “Run out in X hours/days” estimate
- Warning thresholds
- Per-codebase tracking
- Multi-provider support: Gemini, Claude, GPT, etc.
- Simple chart/sparkline
- Local-first data model
- Export/import JSON
- Tiny info button on each model card explaining the forecast
- Tips info card on best practices to reduce token utilization

Forecasting rules:
- Estimate runway for every model automatically
- Use remaining credits/tokens divided by rolling average burn rate
- Show confidence band or range
- If data is sparse, label confidence as low

UI:
- Floating widget
- Compact mode toggle
- Expanded mode
- Info tooltip/card with token-saving tips
- Transparent light glass effect
- Minimal clutter
- No dark mode priority

Tips card content:
- Prompt caching is the highest-leverage lever
- Keep stable content first: system prompt, tool schemas, reference docs
- Put dynamic content last: user input, timestamps, request IDs
- Use prompt caching whenever supported
- Prefer structured outputs to reduce verbosity and retries
- Keep schemas flat and minimal
- Reuse retrieval context instead of resending it
- Reuse summaries instead of full transcripts
- Batch related edits
- Use the cheapest model that can do the job
- Split plan / build / debug across different models

Deliver:
- Page layout
- Component tree
- Model cards
- Forecast panel
- Pricing table
- Settings drawer
- Compact/widget mode toggle
- Tips/info card component


Forecast logic:
- Forecast runway for every provider/model added.
- Use rolling burn rate over 1h, 5h, 3d, 7d, and 14d.
- Primary formula: remaining budget / weighted average daily burn.
- Show hours left, days left, and projected exhaustion date.
- If data is sparse, show low-confidence forecast.

Pricing logic:
- Use live provider pricing data when an API or official endpoint is available.
- If live pricing is unavailable, fall back to a local editable pricing catalog.
- Do not infer pricing from news or blog posts.
- Make pricing source visible in the UI.
- Support manual override per model.

Testing:
- on local build I will add my API's, to seed the app with data.

- Notes on getting more out of Free Tier LLM:
- Claude Code's free tier quotas are dynamic and depend heavily on global server load. To maximize your usage, leverage off-peak times by avoiding the peak hours of 9:00 AM to 5:00 PM US Central Time, when business traffic is highest. Early mornings before 7:00 AM or late evenings are your best window for more messages per 5-hour limit.1. Master Context ManagementClaude reads and reloads the entire conversation history with every new message, which burns through your token limit.Start fresh early: Do not let a single chat go over 15-20 messages. Instead, start a new chat for every new task to reset the context window.Compress chats: Before starting a new thread, ask Claude: "Summarize our discussion in 200 words, formatted as a system prompt for my next chat: key decisions made, code patterns established, next steps." Paste this short summary into your new chat to retain context for only a fraction of the token cost.2. Batch Your RequestsSending three separate messages for three simple adjustments eats your token quota.Combine related debugging tasks, questions, and requests into one single, highly specific message.Use the built-in terminal shortcuts in Claude Code to manage your workflow smoothly without relying on back-and-forth messaging.3. Edit Prompts Instead of CorrectingIf Claude misses the mark, do not say "No, do it this way" in a follow-up message. Every follow-up eats your quota. Instead, edit the original prompt in place by appending the new constraints and regenerate.4. Utilize Free Tier WorkaroundsIf you find yourself frequently hitting your limits, consider integrating your Claude Code setup with alternative, more generous APIs:Connect your terminal to OpenRouter, which offers a large number of daily messages using free models.You can easily bypass the strict 15–40 messages/5-hour quota by setting your base URL and authentication tokens in your local configuration files to route through other free-tier options.
- 
