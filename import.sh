#!/bin/bash

vcaLoc="./bundle"

function import_vca() {
    local vcaLoc="./bundle"
    cd "$vcaLoc" || exit 1
    local zipname="Visual-Capes-Addon_${1:-"bundled"}.mcaddon"
    local temp="$PWD/$zipname"
    zip -rv "$temp" \
    VisualCapesRP/ \
    VisualCapesBP/ \
    VisualCapesExt/
    if [ $? -ne 0 ]; then
        echo "Import Script Aborted." >&2
        exit 1
    fi
    # Termux:API command line
    termux-open --content-type "com.mojang.minecraftpe.mcaddon" "$temp" || {
        echo "Encountered errors opening file." >&2
        exit 1
    }
    echo "Successful!"
}

function completeImport() {
    local devJS
    devJS=$(find . -name dev_forms.js)
    if [ ! -f "$devJS" ]; then
        echo "Visual Capes Add-on bundle is done."
        exit 1
    fi
    mv -fv "$devJS" ./test/dev_forms.js.old || {
        echo "Failed to remove Dev Mode. Aborted." >&2
        exit 1
    }
    import_vca "RELEASE"
}

function import_vcaRP() {
    local testPath="../test"
    cd "$vcaLoc" || exit 1
    local zipname="Visual-Capes-Addon_${1:-"RP"}.mcpack"
    local temp="$PWD/$zipname"
    zip -rv "$temp" VisualCapesRP/ || {
        echo "Import Script Aborted." >&2
        exit 1
    }
    cd "$testPath" || {
        echo "Failed to process RP Only manifest!" >&2
        exit 1
    }
    zip -rv "../bundle/$zipname" VisualCapesRP/
    # Termux:API command line
    termux-open --content-type "com.mojang.minecraftpe.mcpack" "$temp" || {
        echo "Encountered errors opening file." >&2
        exit 1
    }
    echo "Successful! [RP Only]"
}

if [[ "$1" == "cln" ]]; then 
    rm -rvf ./bundle/Visual-Capes-Addon_*.{mcaddon,mcpack}
    echo "Deleted Visual-Capes-Addon archives."
elif [[ "$1" == "RP" ]]; then
    import_vcaRP "$2"
elif [[ "$1" == "checkout" ]]; then
    completeImport
else
    import_vca "$1"
fi
