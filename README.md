# Background Research Module

This is the BRM website, converted to use the 11ty(eleventy.js) Static Site Generator, using Nunjucks (.njk) templates

## Installation
* clone this respository to a sibling directory to your `isptutor_brmstudent`
  git repo (side-by-side folders)

  * *The importance of the two folders living side by side is that scripts for generating templates from the original need to know where to look, as do the scripts which compare the original html files to the generated html files*

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

## Scripts

there are 2 scripts, you don't *necessarily* need to install/use these as I can run them, and I haven't yet figured out what complications may arise from trying to install/run them on Windows may be *yet*:

### 1. template (re)generation script **(scripts/create_templates.py)**

This script scapes the content of the `../isptutor_brmstudent` index.html files, extracts the necessary html snippets, and generates parallel template files in `templates/brm/`, named `index.njk` rather then `index.html`.

    I *should* be able to make slight change to the scripts (perhaps as simple as changing of the path to the original site from being `../isptutor_brmstudent` to simply `dist/brm`).  I may want to come up with some sort of backing up the previous build for the purpose of supporting the comparison script (#2 below)

  ### Installation
  `python3` and `pipenv` are required, whose installation is beyond the scope of this readme, primarily as instructions for those vary with operating system. I can look into this, if you actually care and want to run these.

1. once those are installed, you can them install the required python software via `pipenv install`


  ### Usage
  1. first type `pipenv shell`, afterwards, your terminal prompt with be preceeded by `(brm_templates)`.
  2. you will then be able to type `python scripts/create_templates.py`, which then scrape all of the index.html files in your `isptutor_brmstudent` directory and clobber all of the various `templates/brm/**/*.njk` files.  Unless changes have been made to  `isptutor_brmstudent` website (or the scripts themselves), the content of generated templates should remain identical (won't show up as having changed in git, *despite being entirely regenerated files*)

### 2. original html <-> generated html comparison script **(scripts/compare.sh)**
   1. this turned out to be a lot more complicated that I had hoped, because the python package (BeautifulSoup4) used by the template generation script automatically re-orders the html elements attributes, meaning that: `<div id="page1" class="page">` becomes: `<div class="page" id="page1">`
      1. this results in **every** page being different, even if there are no real differences in actual content or page structure (which is what we're **actually** interested in).
   2. I found some *html-specific* tools which could handle variance of element attribute order, but to my surprise, **couldn't** handle differences in white-space. again, reporting **every** file as different.
   3. my solution involves a **post-processing** step. it:
      1. iterates over both all the generated html files (in `dist/brm`) and the originals (in the sibling `../isptutor_brmstudent`)
      2. passing each of these files through a tool which understood html syntax (`html-minifier-terser`), and instructed it how to reformat the files
         1. It leaves the original files alone and saves the *reformatted* output to parallel **reformatted/orig** and **reformatted/gen** folders) within this repo (which I involved git to ignore)
   4. good ole unix `diff`) can them be used to compare these reformated trees of files.

  ### Installation
    NOTE: I don't recommend you install (or use this script), at this time, as I have no idea if it will work on windows, whether portions of it are still necessary, etc.  If you feel like trying though, it will be harmless

  `npm install -g  html-minifier-terser`

  ### Usage
I usually type this command this in a separate bash terminal outside of vscode (although getting that working in windows might be an ordeal), as there is a lot of output:

`bash scripts/compare.sh`

This wil list all of the files which are different without actually listing their actual differences. Most of the differences are minor things which actually don't have any effect on what the pages look like, but need to be checked just to make sure.  Eventually getting this down so I can have a simple listing of differences we actually care about is a goal.

Actually looking at those differences is something I will write up at a later time (if you're actually interested)
