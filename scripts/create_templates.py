import os
import sys

from bs4 import BeautifulSoup

from brm import (BRM_PATH, spider_links, normalize_links)


def gen_popup_templates():
    categorized_files = spider_links()
    popup_files = categorized_files["popup_files"]
    for file_name in sorted(popup_files):
        print(file_name)
        inpath = os.path.join("..", "isptutor_brmstudent", file_name)

        out_file_name = "%s.njk" % os.path.splitext(file_name)[0]
        outpath = os.path.join("templates", "brm", out_file_name)
        outdir = os.path.dirname(outpath)
        if not os.path.exists(outdir):
            os.makedirs(outdir)

        with open(inpath, "r") as ifh:
            # soup = BeautifulSoup(ifh, "html.parser")
            soup = BeautifulSoup(ifh, "html5lib")
            title = soup.find("title")
            head = soup.find("head")
            extra_style = head.find("style")
            body = soup.find("body")

            output = f"""---
title: "{title.text}"
permalink: /brm/{file_name}
---
            """

            output += """
{% extends "popup.njk" %}
            """

            if extra_style:
                output += """
{%% block page_specific_style %%}
%s
{%% endblock %%}
            """ % str(extra_style)

            output += """
{% block page_content %}
            """
            for child in body.children:
                output += str(child)

            output += """
{% endblock %}
            """

            with open(outpath, "w") as ofh:
                ofh.write(output)


def gen_non_units_templates():
    categorized_files = spider_links()
    # non_units_files category is more of a grouping of various file categories
    # so that which files are units_files can be computed, rather than all
    # non_units_files requiring the same page extraction or usage of the same
    # template.  for now I'm going to grab what I want and merge things which
    # require the same processing together (which for the timebeing may be
    # the same as 'non_units_files', but that my not always be the case, which
    # is the purpose of this explanation)
    indices = categorized_files["indices"]
    old_indices = categorized_files["old_indices"]
    other_files = categorized_files["other_files"]
    animation_files = categorized_files["animation_files"]

    non_units_files = indices | old_indices | other_files | animation_files

    for file_name in sorted(non_units_files):
        print(file_name)
        inpath = os.path.join("..", "isptutor_brmstudent", file_name)

        out_file_name = "%s.njk" % os.path.splitext(file_name)[0]
        outpath = os.path.join("templates", "brm", out_file_name)
        outdir = os.path.dirname(outpath)
        if not os.path.exists(outdir):
            os.makedirs(outdir)

        with open(inpath, "r") as ifh:
            # soup = BeautifulSoup(ifh, "html.parser")
            soup = BeautifulSoup(ifh, "html5lib")
            title = soup.find("title")
            # head = soup.find("head")
            # extra_style = head.find("style")
            page_container = soup.find("div", class_="page-container")
            # nav_btns = soup.find("div", class_="nav-btn-container")
            # nav_btns.decompose()

            output = f"""---
title: "{title.text}"
permalink: /brm/{file_name}
---
            """

            output += """
{% extends "brm.njk" %}
            """

#             if extra_style:
#                 output += """
# {%% block page_specific_style %%}
# %s
# {%% endblock %%}
#             """ % str(extra_style)

            output += """
{% block page_content %}
            """

            for child in page_container.children:
                output += str(child)

            output += """
{% endblock %}
"""

            with open(outpath, "w") as ofh:
                ofh.write(output)
        # break


def gen_units_templates():
    categorized_files = spider_links()
    units_files = categorized_files["units_files"]

    for file_name in sorted(units_files):
        print(file_name)
        inpath = os.path.join("..", "isptutor_brmstudent", file_name)

        out_file_name = "%s.njk" % os.path.splitext(file_name)[0]
        outpath = os.path.join("templates", "brm", out_file_name)
        outdir = os.path.dirname(outpath)
        if not os.path.exists(outdir):
            os.makedirs(outdir)

        with open(inpath, "r") as ifh:
            # soup = BeautifulSoup(ifh, "html.parser")
            soup = BeautifulSoup(ifh, "html5lib")
            title = soup.find("title")
            head = soup.find("head")
            extra_style = head.find("style")
            page_container = soup.find("div", class_="page-container")
            nav_btns = soup.find("div", class_="nav-btn-container")
            nav_btns.decompose()

            output = f"""---
title: "{title.text}"
permalink: /brm/{file_name}
---
            """

            output += """
{% extends "brm_unit.njk" %}
            """

            if extra_style:
                output += """
{%% block page_specific_style %%}
%s
{%% endblock %%}
            """ % str(extra_style)

            output += """
{% block page_content %}
            """

            h1 = page_container.find("h1")
            if h1:
                output += str(h1)
                h1.decompose()
            pages = "\n"
            for page in page_container.find_all("div", class_="page"):
                pages += "\n"
                pages += str(page)
                pages += "\n"
                page.decompose()

            toc = soup.find("div", class_="nav-toc-container")
            if toc:
                toc.extract()

            output += pages

            output += """
{% endblock %}
            """
    #         output += """
    # <!-- Nav Buttons -->
    # {% include "nav_btns.njk" %}
    #         """

            if toc:
                output += """
{%% block toc %%}
%s
{%% endblock %%}
                """ % str(toc)

            with open(outpath, "w") as ofh:
                ofh.write(output)
        # break

if __name__ == "__main__":
    gen_popup_templates()
    gen_non_units_templates()
    gen_units_templates()
