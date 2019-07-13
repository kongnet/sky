{
  "extends": [
    "stylelint-config-rational-order",
    "stylelint-config-prettier"
  ],
  "plugins": [
    "stylelint-order",
    "stylelint-declaration-block-no-ignored-properties"
  ],
  "rules": {
    "no-descending-specificity": null,
    "plugin/declaration-block-no-ignored-properties": true,
    "font-family-no-missing-generic-family-keyword": null,
    "property-no-unknown": [ true, {
      "ignoreProperties": [
        "composes",
        "lines",
        "placeholder-color",
        "item-selected-color",
        "item-color",
        "item-size"
      ]
    }],
    "selector-type-no-unknown": [ true, {
      "severity": "warning",
      "ignoreTypes": ["cover-view"]
    }],
    "unit-no-unknown": [ true, {
      "severity": "warning",
      "ignoreUnits": ["wx"]
    }]
  }
}
