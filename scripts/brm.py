#!/usr/bin/env python

from glob import glob
import os
from pprint import pprint
from sys import exit

from bs4 import BeautifulSoup

BRM_PATH = "../isptutor_brmstudent/"


def dump_list(label, values):
    print()
    print(label)
    print("===================")
    for i in sorted(values):
        print(i)
    print()


def get_path_to_brm_file(file_name):
    return os.path.join(BRM_PATH, file_name)


def normalize_links(lnks):
    for i, lnk in enumerate(lnks):
        if lnk.startswith("../"):
            lnk = lnk.replace("../", "")
        if not lnk.endswith("/index.html"):
            lnk += "index.html"
        lnks[i] = lnk
    return lnks


def spider_links():
    all_html_files = set(
        match.replace(BRM_PATH, "")
        for match in glob("%s*/index.html" % BRM_PATH)
    )

    indices = set([
        "all-units/index.html",
        "areachemphys/index.html",
        "area_forcesmotion/index.html",
        "area_heattemp/index.html",
        "Area_PlantReproduction/index.html",
    ])

    old_indices = set([
        "atoms-molecules-1/index.html",
        "energy/index.html",
        "general/index.html",
        "misc/index.html",
        "plants-1/index.html"
    ])

    other_files = set([
        "areasofscience/index.html",
        "help/index.html",
        "home/index.html",
        "inhelp/index.html",
        "searchpage/index.html",
    ])

    animation_files = set(
        fn
        for fn in all_html_files
        if "Animation" in fn
    )

    # these have minimal strucure, a title, a body, and potentially,
    # a page-specific <style> in the head
    popup_files = set([
        "AlgaeFigCitation/index.html",
        "glossary/index.html"
    ])

    # this are similar to units files (same page structure), but differ in that
    # they might only be referenced from other unit pages, which I *believe* is
    # the reason they are being singled out here,  treat as units for now, but
    # need to be identified for potential different processing in the future
    supplemental_files = set([
        "color-color-perception/index.html",
        "issacnewton/index.html",
        "orbitals/index.html",
        "rainbow/index.html"
    ])

    # these might different categories might require separate extractors and/or templates
    # they are merely being grouped together so I can comput what the 'units_files' are
    #
    # supplemental_files will use the same extractor and template as 'units_files' for now,
    # so I'm not adding them to this set (for now), causing them to be grouped with
    # units_files (for now)
    non_units_files = indices | old_indices | other_files | animation_files | popup_files

    units_files = all_html_files - non_units_files


    units_by_index = {}
    for index_file in indices:
        fn = os.path.join("..", "isptutor_brmstudent", index_file)
        index = index_file.replace("/index.html", "")
        with open(fn, "r") as fh:
            soup = BeautifulSoup(fh, 'html.parser')
            page = soup.find("div", class_="page-container")
            links = [a.attrs['href'] for a in page.find_all('a')]
            units_by_index[index] = set(normalize_links(links))

    all_units_files = None
    with open(get_path_to_brm_file("all-units/index.html"), "r") as fh:
        soup = BeautifulSoup(fh, "html.parser")
        page = soup.find("div", class_="page-container")
        all_units_files = set(
            normalize_links([a.attrs['href'] for a in page.find_all('a')])
        )
    old_indices_files = set([])
    for oif in old_indices:
        with open(get_path_to_brm_file(oif), "r") as fh:
            soup = BeautifulSoup(fh, "html.parser")
            page = soup.find("div", class_="page-container")
            links = normalize_links([a.attrs['href'] for a in page.find_all('a')])
            for link in links:
                old_indices_files.add(link)

    missing_all_units_files = old_indices_files - all_units_files - non_units_files

    all_units_by_index = set()
    for value in units_by_index.values():
        for val in value:
            all_units_by_index.add(val)

    non_indexed_files = units_files - all_units_by_index

    return {
        "all_html_files": all_html_files,
        "indices": indices,
        "old_indices": old_indices,
        "other_files": other_files,
        "animation_files": animation_files,
        "popup_files": popup_files,
        "supplemental_files": supplemental_files,
        "non_units_files": non_units_files,
        "units_files": units_files,
        "units_by_index": units_by_index,
        "missing_all_units_files": missing_all_units_files,
        "non_indexed_files": non_indexed_files
    }
