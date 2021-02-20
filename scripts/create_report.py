# ugg, I don't know why pylint freaks out if I don't use .brm but python itself doesn't like .brm
from brm import (dump_list, spider_links, normalize_links) #pylint:disable=import-error


def gen_report():
    categorized_files = spider_links()
    indices = categorized_files["indices"]
    old_indices = categorized_files["old_indices"]
    other_files = categorized_files["other_files"]
    animation_files = categorized_files["animation_files"]
    non_units_files = categorized_files["non_units_files"]
    units_files = categorized_files["units_files"]
    non_indexed_files = categorized_files["non_indexed_files"]
    missing_all_units_files = categorized_files["missing_all_units_files"]
    dump_list("indices", indices)
    dump_list("old_indices", old_indices)
    dump_list(
        """
other_files - files I'm manually adding to prevent being listed
(at end of file) as non-indexed-files""", other_files)
    dump_list("animation_files", animation_files)
    dump_list(
        "non-units files: indices + old_indices + other_files + animation_files",
        non_units_files
    )
    dump_list("units_files: everything remaining from all_files (not listed)", units_files)
    dump_list(
        """
non-indexed-files - should these be categorized as 'units'
(and thus they need to be added somewhere), or 'other files')""", non_indexed_files)
    dump_list("files listed in old_indices not listed in all_units",
              missing_all_units_files)
    # print("Units not indexed in any of:")
    # print("======================================")
    # for uf in sorted(indices):
    #     print(uf)
    # print("--------------------------------------")
    # for missing in sorted(not_in_units_by_index):
    #     print(missing)

def gen_csv(indices, units_files, units_by_index):
    categorized_files = spider_links()
    indices = categorized_files["indices"]
    units_files = categorized_files["units_files"]
    units_by_index = categorized_files["units_by_index"]

    heading = '"filename","' + '","'.join([
        index.replace("/index.html", "")
        for index in sorted(indices)
    ]) + '"'
    print(heading)
    # for file_name in sorted(units_files):
    #     print('"%s",' % file_name.replace("/index.html", ""), end="")
    #     print(",".join([ str(int(file_name in units_by_index[key]))
    #                      for key in sorted(units_by_index.keys())]))

if __name__ == "__main__":
    gen_report()
