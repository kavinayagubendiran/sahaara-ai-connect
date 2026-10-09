# Sahaara AI Connect

Build a complete, beginner-friendly, working web app prototype called Sahaara AI.

TAGLINE: Every Need Deserves a Resolution.

PURPOSE:
Sahaara AI helps people in need connect with community volunteers and available resources. This is a social-impact project for a hackathon.

DESIGN:

- Modern, professional, clean interface.
- White background with forest-green and teal accents.
- Rounded cards, attractive icons, clear typography, and responsive layouts.
- Make it look like a polished startup product.
- Use fictional demo data.
- Make all screens easy to navigate.

BUILD THREE CONNECTED PAGES:

PAGE 1: HOME AND REQUEST HELP

- Show the Sahaara AI name and navigation.
- Display the headline “Help is closer than you think.”
- Add a short description of the project.
- Create a request form with name, category, description, approximate location, and urgency.
- Categories: Food, Clothing, Medical Assistance, Transport, Shelter, and Other.
- Add a “Submit Request” button.
- Validate the form and display a success message after submission.
- Add a button to navigate to the coordinator dashboard.

PAGE 2: COORDINATOR DASHBOARD

- Display at least six fictional help requests.
- Show request ID, category, location, urgency, and status.
- Include Pending, Matched, In Progress, and Fulfilled statuses.
- Add search and category filters.
- Add a “Find Match” button for every request.
- Display suitable fictional volunteers or resources when matching is requested.
- Explain why each resource is recommended.
- Add functional buttons to assign a resource and update the request status.
- Newly submitted requests must appear here.

PAGE 3: IMPACT DASHBOARD

- Display total requests, pending requests, matched requests, and fulfilled requests.
- Add a chart showing requests by category.
- Display an unmet-needs section.
- Update the statistics when requests change status.

FUNCTIONAL REQUIREMENTS:

- Build a functional application, not just a static design.
- All navigation and buttons must work.
- Use shared application state so all pages show consistent information.
- Save prototype data in browser local storage if possible.
- Implement matching using simple rules based on category, urgency, location, and availability.
- No login, database, payment, or external API keys should be required for the first demo.
- Clearly label AI matching as simulated if no real AI integration exists.
- Do not claim that real volunteers have been contacted or assistance has been delivered.
- Use fictional sample data only.

CODE AND PROJECT REQUIREMENTS:

- Use React with TypeScript and a clean, maintainable component structure.
- Keep the app easy to run locally and prepare it for GitHub.
- Do not overcomplicate the implementation.
- Prioritize working features over unnecessary extras.
- Build the complete first version now, and tell me how to preview and test it.

Start by creating the working application with all three connected pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4d558783-87d2-4170-b775-6b146dc09734).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
