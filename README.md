# Frames V2 Setup

This guide will walk you through setting up, customizing, and deploying the Frames V2 demo project.


## Getting Started

This is a [NextJS](https://nextjs.org/) + TypeScript + React app.



### Clone this repository:
```bash
    git clone https://github.com/farcasterxyz/frames-v2-demo.git
 ```

### Install dependencies:
Add `react` and `react-dom` to the project:
```bash
    yarn add react react-dom
```
### Configure environment variables:

1. Rename `example.env` to `.env`.
2. Add the following environment variables to the .env file:
```bash
NEXT_PUBLIC_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secure-secret>
```
Generate a secure secret using Node.js with the following command and 
replace `<generated-secure-secret>` with the generated string.
```bash
 node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
### Modify Frame Metadata
open the following folder and replace splash.png and icon.png

```bash
.\frames-v2-demo\public
```
Modify Frame Image as required in
```bash
.\frames-v2-demo\src\app\opengraph-image.tsx
```
debug the Farme image on [localhost:3000](http://localhost:3000/opengraph-image)
 
### Start the Development Server
Run the development server:
```bash
yarn dev
```

### Expose Localhost with Ngrok

Use Ngrok to expose your localhost:
```bash
ngrok http 3000
```
Copy the Ngrok URL and paste it into the [Frame Playground](https://warpcast.com/~/developers/frame-playground). While debugging, you can skip adding a splash image URL and splash background color.

- Click on Launch. 
### Modify the Demo Component
To customize the frame, edit the Demo.tsx file:
```bash
./frames-v2-demo/src/components/Demo.tsx
```
## Deploy the Project

### Initialize a New Git Repository
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/{username}/{repository-name}.git
git push -u origin master
```
### Deploy to Vercel
1. Open Vercel and click Add New > Project.

2. Import your repository.

3. Add the following environment variable during the setup:
- Key: `NEXTAUTH_SECRET`
- Value: `<generated-secure-secret>`
4. Click Deploy.

## Post-Deployment Configuration
1. Go to the Dashboard in Vercel and copy your deployment URL.
2. Add these environment variables in the Settings > Environment Variables section:
```bash
NEXTAUTH_URL: https://<your-vercel-domain>
NEXT_PUBLIC_URL: https://<your-vercel-domain>
```
3. Save the changes.

## Integrate your Farcaster account with Frame 
1. Open the Domains section in Frame Playground.
2. Paste the Vercel domain (e.g., frame-demo-three.vercel.app).
3. Untick Include Example Definition.
4. Generate the domain manifest (this will be copied to your clipboard).
### Update Farcaster Route
1. Open the file:
```bash
./frames-v2-demo/src/app/.well-known/farcaster.json/route.ts
```
2. Replace the `accountAssociation` object as needed.
3. Push the changes to your repository:
```bash
git add .
git commit -m "Update Farcaster route"
git push
```
Vercel will automatically deploy the updated code.
## View Your Frame
Paste the Vercel URL into Frame Embed in the [Frame Playground](https://warpcast.com/~/developers/frame-playground).
Test and enjoy your customized frame!
