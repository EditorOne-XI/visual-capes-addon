# Contributing

To help improve this add-on and maintain its updates, you can fork this repository and make a pull request after creating a new feature, bug fixes, or add-on improvements. The following features are recommended to be implemented:

* **Language Translation (Locale)**
    * Currently only English US locale is available.
    * Not all texts are translatable such as Rarity Names.
* **Custom Preset Capes**
    * Add new capes of your design!
    * The cape(s)' rarity must be specified.
    * The designer's credit must be included from the texture itself.
* **Version Update Maintenance**
    * Compatibility over future Minecraft updates only.
    * Compatibility over other Minecraft packs to be included in pack's settings. (Strict)

To fully turn on development of this add-on to your local device (Linux). Use the `mergeBundle.sh` shell script to merge the ZIP file with `.bundle` as file extension and execute `cp ./test/dev_forms.js.old ./bundle/VisualCapesExt/scripts/dev_forms.js` to enable developer forms. Also read instructions inside `dev_forms.js` to fully implement its functions.

When a pull request successfully merged to this repository, contributors are also added from the add-on's LICENSE.txt files.

