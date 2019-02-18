const Bundler = require("parcel-bundler")
const Terser = require("terser")
const path = require("path")
const fs = require("fs")

const validatorDir = path.join(__dirname, "src")
const outDir = path.join(__dirname, "dist")
const outFile = path.join(outDir, "compiled.min.js")

const parcelOptions = {
  production: true,
  cache: false,
  target: "browser",
  minify: false,
  outDir: outDir,
  outFile: "compiled.js",
  sourceMaps: false,
  logLevel: 1
}

const terserOptions = {
  warnings: true,
  safari10: true,
  mangle: false,
  compress: false
}

const files = path.join(validatorDir, "*.js")

module.exports.build = () => {
  return new Promise((resolve, reject) => {
    const bundler = new Bundler(files, parcelOptions)

    bundler.bundle().then((resolved) => {
      const compiled = fs.readFileSync(path.join(outDir, "compiled.js"), "utf8")
      const minified = Terser.minify(compiled, terserOptions)
      fs.writeFileSync(outFile, minified.code, "utf8")
      resolve(outFile)
    }, (error) => {
      reject(error)
    })
  })
}