#!/bin/bash

ORIG_PROJ="${HOME}/projects/isptutor_brmstudent"
GEN_PROJ="${HOME}/projects/brm_templates"
ORIG_PATH=$ORIG_PROJ
GEN_PATH="${GEN_PROJ}/dist/brm"
ORIG_REFORMAT="${GEN_PROJ}/reformatted/orig"
GEN_REFORMAT="${GEN_PROJ}/reformatted/gen"

# make sure I'm still not comparing files which no longer exist
rm -rf ${ORIG_REFORMAT}
rm -rf ${GEN_REFORMAT}

echo "Comparing files..."
for gf in $(find $GEN_PATH -name 'index.html' | sort); do
    bn=$(basename `dirname ${gf}`);
    of="${ORIG_PATH}/${bn}/index.html"
    ond="${ORIG_REFORMAT}/${bn}"
    gnd="${GEN_REFORMAT}/${bn}"
    or="${ond}/index.html"
    gr="${gnd}/index.html"
    echo -n "${bn}... "
    mkdir -p $ond
    mkdir -p $gnd
    html-minifier-terser --collapse-whitespace \
                         --preserve-line-breaks \
                         --sort-attributes \
                         --collapse-boolean-attributes \
                         ${of} > ${or}
    html-minifier-terser --collapse-whitespace \
                         --preserve-line-breaks \
                         --sort-attributes \
                         --collapse-boolean-attributes \
                         ${gf} > ${gr}

done
num_brm_files=$(find ${ORIG_PROJ} -name 'index.html' | wc -l)
num_orig_files=$(find ${ORIG_REFORMAT} -name 'index.html' | wc -l)
num_gen_files=$(find ${GEN_REFORMAT} -name 'index.html' | wc -l)
num_diffs=$(diff -w -b -B -r --brief ${ORIG_REFORMAT} ${GEN_REFORMAT} | wc -l)

echo ""
echo ""
echo "num_brm_files: ${num_brm_files} num orig files: ${num_orig_files} num gen_files: ${num_gen_files}"
echo ""
echo ""
echo "${num_diffs} files have differences"
echo ""
diff -w -b -B -r --brief ${ORIG_REFORMAT} ${GEN_REFORMAT}
