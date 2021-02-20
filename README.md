# Background Research Module

This is the BRM website, converted to use the 11ty(eleventy.js) Static Site Generator, using Nunjucks (.njk) templates

## Installation
* clone this respository to a sibling directory to your `isptutor_brmstudent` git repo (side-by-side folders).

* open up the folder in VS code.

* from the VS code select "File/Open Workspace", and then select the "brm_templates.code-workspace" (within this folder)
  * From then on, you can return to this by simply making use of VS Code's "File/Open Recent" and then select (some path)/brm_templates (Workspace)
* open terminal (within VS code)

* type `yarn` and press return.  This will install all of software necessary to build the BRM website from the templates

## Working on the website

* you have 2 options which provide the same function, use whichever you're either more familiar with, or which you find easiest

1. npm scripts::watch combined with VS Code's "Go Live" feature
2. npm scripts::start

## Creating a build of the website

* from npm scripts, run "build"
  * the contents of the website are in the `dist/brm` folder

## Deploying the changes
this is a work in progress.  currently what is required is
1. copy the contents of dist/brm (not the brm folder itself, just it's contents) to your isptutor_brmstudent folder
   1. use your favorite tool to inspect any changes prior to commiting
   2. if you don't like the changes revert them
2. commit and push the changes
3. do a pull on hypatia

eventually, this will be simplified to running an `npm deploy` script, but I want to make sure everything is working properly before we hang ourselves with this nice bit of rope someone gave us...

## scripts
the scripts are only necessary for regenerating templates from the main website, and are not required

they require python3 and pipenv. whose installation is beyond the scope of this readme, primarily as instructions for those vary with operating system

if you have those installed you can install the python dependencies via
pipenv install

in order to run scripts, you will need to first type `pipenv shell`, afterwards, your terminal prompt with be preceeded by `(brm_templates)`

typing `python scripts/create_templates.py`  will scrape all of the index.html files in your isptutor_brmstudent directory and clobber all of the various templates/brm/**/*.njk files.  Unless changes have been made to the brm website or the scripts themselves, the newly generated templates should be identical (won't show up as having changed in git.)