# Background Research Module

This is the BRM website, converted to use the 11ty(eleventy.js) Static Site Generator, using Nunjucks (.njk) templates

## Installation
* clone this respository to a sibling directory to your `isptutor_brmstudent`
  git repo (side-by-side folders) [^1].

[^1]: (The importance of the two folders living side by side is that scripts for generating templates from the original need to know where to look, as do the scripts which compare the original html filess to the generated html files)

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

## templage generation scripts
the scripts are only necessary for regenerating templates from the original website, and are not required once changes aren't being made to the original website.

I should be able to make slight change to the scripts (perhaps as simple as changing of the path to the original site from being ../isptutor_brmstudent to simply dist/brm), although I may want to come up with some sort of backing up the previous build so the prev/current can be compared...

anyway, these scripts require python3 and pipenv (as well as bash) whose installation is beyond the scope of this readme, primarily as instructions for those vary with operating system

if you have those installed you can install the python dependencies via
pipenv install

in order to run scripts, you will need to first type `pipenv shell`, afterwards, your terminal prompt with be preceeded by `(brm_templates)`

typing `python scripts/create_templates.py`  will scrape all of the index.html files in your isptutor_brmstudent directory and clobber all of the various templates/brm/**/*.njk files.  Unless changes have been made to the brm website or the scripts themselves, the newly generated templates should be identical (won't show up as having changed in git.)

## comparing the original html to the newly generated html
this turned out to be a little more complicated that I had hoped, because the python software I use to extract the various html snippets from the original pages and insert into the templates automatically re-orders the html elements attributes (whether this is alphabetical, or if the developer(s) have other opionionated order, I don't know) meaning that even though it's not that difficult to compare files while ignoring differences in whitespace, those tools don't know anything about html, and will report every occuracance of:

 `<div id="page1" class="page">`
 being changed to:

 `<div class="page" id="page1">`

 as a difference, resulting in **every** page being reported as different.

Other, html-specific tools which I found *(and believe I searched all over the place as this was a long and arduous process and I did everything I could think of to make my life easier)*  could handle variance of element attribute order, but to my surprise, **couldn't** handle differences in white-space.  To be fair, this *might* be by design where the intent of the tools was to preseve the whitespace the author specified.

anyway, I came up with a way to compare the files via a post-processing step.
It iterates over both all the generated html files (in `dist/brm`) and the originals (in the sibling `../isptutor_brmstudent`)  passing them through a tool which understood html syntax (`html-minifier-terser`), and instructed it how to reformat the files (leaving original files alone - saving the output to a "reformatted" folder) in a way which another tool which doesn't understand html (good ole unix `diff`)could compare them.

typing (and I usually do this in a separate bash terminal outside of vscode, as there is a lot of output)