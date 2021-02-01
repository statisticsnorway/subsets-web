# Classification subsets web application

## Table of Contents
- [UI Usage](#ui-usage)
- [Data structures](#data-structures)
  - [Internal](#internal)
  - [Subsets API](#subsets-api)
  - [Klass API](#klass-api)
  - [GSIM schema](#gsim-schema)
- [API Guide](#api-guide)
- [Tech Stack](#tech-stack)
  - [React web application](#react-web-application)
- [Frontend](#frontend)
  - [Context Management](#context-management)
  - [Styling](#styling)
  - [Tests](#tests)
  - [Fetcher](#fetcher)
  - [PWA](#pwa)
  - [Internationalization](#internationalization)
  - [Session management](#session-management)
  - [Error handling](#error-handlig)
  - [Cache](#cache)
  - [File structure](#file-structure)
- [Backend](#backend)
  - [Single page](#single-page)
  - [Log](#log)
  - [Deployment](#deployment)
    - [Localhost](#lLocalhost)
    - [Staging](#staging)
    - [Production](#production)
- [Configuration](#configuration)
  - [React scripts](#react-scripts)
- [Integrations and dependencies](#integrations-and-dependencies)
  - [Data flow](#data-flow)
  - [Authentication](#authentication)
  - [Authorisation](#authorisation)
- [Technical debt](#Technical-debt)
  - [Known bugs](#known-bugs)
- [Performance](#performance)
- [User experience](#user-experience)
- [Accessibility](#accessibility)

# UI Usage
The application consist of two main parts:
- View subsets (public).
- Subset draft editor (admin). 
  
## View subsets
This part allows any user to view and search published and drafted subsets. This part does not require authentication.

## Subset draft editor
The editor is a six step interactive form.

# Data structures

### Internal
The main internal data structure is the `Subset.prototype`. It is responsible for holding all data about the subset draft and provide calculations and validation during editing.
In order to persist the user data session storage is used. It updates on each change in the draft.

## Subsets API
### `GET /subsets`
### `GET /subsets/{subsetId}/`
### `GET /subsets/{subsetId}/versions/{versionId}`
### `POST /subsets/{subsetId}/`
### `POST /subsets/{subsetId}/versions/{versionId}`
### `PUT /subsets/{subsetId}/`
### `PUT /subsets/{subsetId}/versions/{versionId}`
### `DELETE /subsets/{subsetId}/`
### `DELETE /subsets/{subsetId}/versions/{versionId}`

## Klass API
### `/classificationFamilies`
### `/ssbsections`
### `/classifications/{classificationId}`
### `/classifications/{classificationId}/versions/{versionId}`
### `/classifications/{classificationId}/codesAt...`

### GSIM schema 

# Client API Guide
### `/subsets`
To get overview over all published and saved subsets in the system.
Search by name through the subsets.
### `/subsets/{subsetId}/`
Shows a particular subset by setting the subsets ID instead of `{subsetsId}`.
A subsets preview page allows to open its versions, as well as open in edition mode.
### `/subsets/{subsetId}/versions/{versionId}`
Shows a particular version of a particular subset. One have to put correct `{subsetUd}` and `{versionId}`in the URL.
### `/editor/*` redirects to `/auth/editor/*`
Opens an empty form for creation and saving a new subset with versions.
Only SSB employees are allowed to create and edit subsets. By redirecting to `/auth` application will redirect to login page.
### `/editor?step={ Metadata | Versions | Codes | Oreder | Review }`
Users can specify a particular form step by naming it as a search parameter `step`. 
If the step name is wrong or outdated, the application will show the first step.
### `/editor?step={ Metadata | Versions | Codes | Oreder | Review }&subsetsId={subsetId}&versionsId={versionId}`
In addition to form step, users can specify `{subsetId}` and `{versionId}`.
### `/auth/save?metadata={ true | false }`
An extra step to save or publish a subset's metadata. 
The payload will be generated from the session storage variable `draft`.
### `/auth/save?version={ true | false }`
An extra step to save or publish a subset's version, which is set to be current.
The payload will be generated from the session storage variable `draft`.
### `/auth/save?metadata={ true | false }version={ true | false }`
An extra step to save or publish a subset's metadata.
An extra step to save or publish a subset's version, which is set to be current.
The payload will be generated from the session storage variable `draft`.

# Tech Stack
React 17 med React hooks
Docker

## React web application
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Frontend

## Context Management

## Styling
CSS

## Tests
Jest

## Fetcher
SWR

## PWA
Issues with drag-and-drop. Additional library has to be installed to convert browser drag-and-drop events into respective mobile events.
Mobile users can still reorder codes by using numbers and arrows.
Issues with responsive design.

## Internationalization
Internationalization is implemented with i18n.js library. The set up is for three languages (nb, nn, en), but oly two in use.

## Session storage
The local session storage is used to keep subset draft in memory throughout editing, site refresh and navigation.
The subset draft resets in session storage when user chose to start a new subset draft. All unsaved changes from the previous edition will be discarded without warning.
Current subset draft in edition mode will be overwritten by next subset draft opened in the editor. All unsaved changes from the previous edition will be discarded without warning.

## Error handling

## Cache
Standard caching is disabled as long as service worker is unregistered. It should be registered before shipping to the production.
SWR library has its own way to cache the response and update the content (stale-while-revalidate), this behaviour can be cofigured.

## Essential File structure
```text
.
├── src
│ ├── components
│ ├── controllers
│ │ ├── context
│ │ ├── klass-api
│ │ └── subsets-api
│ ├── internationalization
│ ├── models
│ │ └── Subset.prototype
│ ├── pages
│ │ ├── SearchSubsets
│ │ ├── editor
│ │ ├── subset
│ │ └── changelog
│ ├── utils
│ └── views
│ │ ├── code
│ │ └── Subset
│ ├── App.js
│ ├── defaults.js
│ └── serviceWorker.js
├── .env
├── azure-pipelines.yml
├── Dockerfile
├── jsconfig.json
├── nginx.conf
├── package.json
└── README.md
```

# Backend
[Subsets API source code](https://github.com/statisticsnorway/klass-subsets-api)

## Deployment
Subset client will automatically be deployed in Staging by pushing / merging into master branch.
In order to deploy in Production follow the [platform-dev instructions](https://github.com/statisticsnorway/platform-dev). 
Configuration files for [production](https://github.com/statisticsnorway/platform-dev/blob/master/flux/prod-bip-app/klass/subsets-client/subsets-client.yaml)
Configuration files for [staging](https://github.com/statisticsnorway/platform-dev/blob/master/flux/staging-bip-app/klass/subsets-client/subsets-client.yaml)

### Localhost

#### Required software
*   Git<br>
    Download and install git.

*   Node.js (npm)<br>
    Download and install [node.js](https://nodejs.org/en/)

*   Browser<br>
    Download and install a modern browser of your choice.<br>
    Recommend to use Chrome, the most secure browser today.

#### Start local server
Install dependencies for the project (production build):
```shell
$ cd /klass-subsets-client
$ npm start
```
In case you need to run a development build do: `$ npm install` instead of `$ npm run build`

#### Start application in a browser
[http://localhost:3000/](http://localhost:3000/)

# Configuration

## React scripts
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm install react-scripts@latest`
Easy to maintain.<br>
Updating your build tooling is typically a daunting and time-consuming task. When new versions of Create React App are released, you can upgrade using this single command.
[https://facebook.github.io/create-react-app/](https://facebook.github.io/create-react-app/)

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved [here:](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved [here:](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved [here:](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved [here:](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved [here:](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved [here:](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Integrations and dependencies
## Data flow
## Authentication
## Authorisation
## Technical debt
## Known bugs
# Performance

# User experience
# Accessibility

# Features
## Codes reordering
The main idea of the draft concept is to keep the internal version of the draft updated at each moment.
The updates could happen on the steps "Choose codes" and "Reordering".

On the "Choose codes" form step codes could be added and removed by clicking on the checkbox (one at a time) or clicking on the "All"/"None" buttons.  
When codes are added to the draft, each code gets the timestamp of addition as a property.
This property will be removed on the "Reorder" form step and "Review" form step.
The timestamp is used to keep codes chosen on the "Choose codes" on the top of the list and ordered according to its clicking order, while the rest of the codes (without a timestamp) are ordered by rank.  

On the "Reorder" form step codes can change their rank and/or can be deleted by clicking on the "Trash" button.

## Saving and publishing subsets
The process of saving a subset is complex because initially a subset was meant to be a single object (Subsets API v1).
In Subsets API v2 a subset is a series of versions, and a version is a set of codes.

### Metadata (subset series)
A series has metadata, it has no difference between saving and publishing.

### Version (subset version)
A version can have different states (administrative status):
- published (OPEN);
- saved (DRAFT);
- not saved (INITIAL), stored locally in Session storage.

### Saving URL and parameters
The saving and publishing process implemented on a single page (hidden 6th step) Step_6_Publish.jsx.
This page is protected by authorization (`/auth/save`). I can be navigated through the URL only.
It should be specified which part of the subset (draft) to save: `metadata=true`, `version=true` or both `?metadata=true&version=true`.
The payload will provide the desired administrative status for the version.
The payload will be generated at the sending point on the same page (hidden 6th step) Step_6_Publish.jsx.
In order to specify which payload to be sent provide search parameter `publish=true`.
If the type of payload is not specified a save payload (with administrativeStatus=DRAFT) will be generated and sent.

### The flow
The communication with Subsets API is implemented in Step_6_Publish.jsx.
All the cases are gathered in a single component. It should be reviewed and refactored to single flows.

### Save a metadata
The flow initiated by clicking the "Save" button on metadata and `/auth/save?metadata=true` is pushed to the browser's history.
If the user is logged in the page will be displayed, and the effects on the component will be fired. Otherwise the user will be redirected to login page.
If the metadata is never been saved before (no `createdDate` registered), a metadata payload will be generated and passed to the usePOST React custom hook.
If metadata was saved before, a metadata payload will be generated and passed to the usePUT React custom hook.
While the application is waiting for the server response, the message "Sending metadata to the server" is displayed for users.
When the server response comes, another effect is fired.
If the response is successful then the "metadata_sync" action is applied to the internal draft context, and the "Metadata is sent" is displayed to the user.
If the response contains an error, the error will be displayed, no synchronization applied.
The application will then wait for the user where to go further, the options are displayed.

### Save a version
The flow initiated by clicking the "Save" button on a chosen version and `/auth/save?version=true` is pushed to the browser's history.
If the user is logged in the page will be displayed, and the effects on the component will be fired. Otherwise the user will be redirected to login page.
If the version is new (no random `versionId` assigned), a version payload will be generated and passed to the usePOST React custom hook.
If the version has a random ID, a version payload will be generated and passed to the usePUT React custom hook.
While the application is waiting for the server response, the message "Sending version to the server" is displayed for users.
When the server response comes, another effect is fired.
If the response is successful then the "version_sync" action is applied to the internal draft context, and the "Metadata is sent" is displayed to the user.
Only the current version will be updated. 
At the moment the application receives the positive response the version ID becomes known. The application still uses tempId to double check than the correct version is getting the updates.
If the response contains an error, the error will be displayed, no synchronization applied.
The application will then wait for the user where to go further, the options are displayed.
If the user chooses to go back to the form, the original (temporary ID) will be used to make a version to be current version in the editor.
The sources for the version ID are:
- from the search parameters of the URL;
- from the context draft's _currentVersion;
- from the successful response.

### Publish a version
The flow initiated by clicking the "Publish" button on a chosen version and `/auth/save?version=true&publish=true` is pushed to the browser's history.
The flow is similar to [Save a version](#save-a-version). The only difference is the `administrtiveStatus: OPEN` in the payload.
In order to make this difference application adds `publish=true` to the URL.

## Duplicate codes
Normally a code in a classification version or a coe list version has a unique code and/or a unique name.
However, it is not true across mulitiple versions of the classification or the code list.
In order to deal with such codes `validFromInRequestedRange` is used to provide uniqueness by combining it with the name and the code in addition to the classification ID.
When the classification codes are displayed it is important to re

