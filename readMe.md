# redux-screen-exploration

Explore solution to define redux store once and use it on multiple similar feature

## Set-Up

Install the current NodeJS (https://nodejs.org/)

Install Git (https://git-scm.com/)

Create a folder and from the command line clone the repository
```
git clone https://github.com/JeanRemiDelteil/maquette-empreinte-energetique.git
```

In the cloned folder, install of required dependencies (from a command line)
```
npm install
```

Setup is Done !

## Test development locally

Run the development server:
```
npm run watch
```

Visit http://localhost:5000 to see the local site

You can edit the code, save, wait for auto-rebuild then refresh the site to see the updated code.

## Build for DEV site, and deploy
You need access to the Firebase project for this.

```
npm run build:devWeb
npm run deploy:devWeb
```
