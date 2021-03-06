"use strict"

// builtin tooling
const fs = require("fs")

// external tooling
const postcss = require("postcss")

// plugin
const atImport = require("../..")

function read(name, ext) {
  if (!ext) ext = ".css"
  return fs.readFileSync(`test/fixtures/${name}${ext}`, "utf8")
}

module.exports = function(t, name, ext, opts, postcssOpts, warnings) {
  opts = Object.assign({ path: "test/fixtures/imports" }, opts)
  return postcss(atImport(opts))
    .process(read(name, ext), postcssOpts || {})
    .then(result => {
      const actual = result.css
      const expected = read(`${name}.expected`)
      // handy thing: checkout actual in the *.actual.css file
      fs.writeFile(`test/fixtures/${name}.actual.css`, actual)
      t.is(actual, expected)
      if (!warnings) warnings = []
      result.warnings().forEach((warning, index) => {
        t.is(
          warning.text,
          warnings[index],
          `unexpected warning: "${warning.text}"`
        )
      })
    })
}
