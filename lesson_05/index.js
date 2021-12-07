'use strict'

const http = require('http')
const _fs = require('fs')
const _path = require('path')
class Path {
  constructor(_dropoff = process.cwd()) {
    this.dropoff = _dropoff
    this.current = '/'
  }
  get previous() {
    return this._previous
  }
  get subdirectory() {
    return this._subdirectory
  }
  set subdirectory(_subdirectory) {
    this._previous = this._subdirectory || ''
    this.current = this.dropoff + '/' + _subdirectory
    this._subdirectory = _subdirectory
  }
  getDirectoryListing(path = this.current) {
    return _fs.readdirSync(this.getAbsolute(path)).map((itemPath) => {
      const _isDirectory = this.isDirectory(itemPath)
      return {
        isDirectory: _isDirectory,
        isFile: !_isDirectory,
        path: itemPath,
        isHidden: itemPath.startsWith('.'),
      }
    })
  }
  isDirectory(path = this.current) {
    return _fs.lstatSync(this.getAbsolute(path)).isDirectory()
  }
  getAbsolute(path) {
    if (!path.startsWith('/')) {
      return _path.join(this.current, path)
    }
    return path
  }
  update(url) {
    this.dirListingRequested = url[url.length - 1] === '/'
    if (this.dirListingRequested) {
      this.subdirectory = url
    }
  }
}

function prettify(path) {
  const noDelimiter = ''
  const prettyDirListing = path
    .getDirectoryListing()
    .map((item) => {
      if (item.isHidden) return
      if (item.isDirectory)
        return `<li class="directory">DIR: <a href="${item.path}/">${item.path}</a></li>`
      if (item.isFile)
        return `<li class="file">FILE: <a target="_blank" href="${item.path}">${item.path}</a></li>`
    })
    .join(noDelimiter)
  return [
    `<html><head></head><body>`,
    '<ul>',
    `<li><a href="${path.previous}">..</a></li>`,
    prettyDirListing,
    '</ul>',
    '</body></html>',
  ].join(noDelimiter)
}

const path = new Path()

http
  .createServer((request, response) => {
    path.update(request.url)
    if (path.dirListingRequested) {
      response.end(prettify(path))
    } else {
      response.end(
        _fs.readFileSync(path.dropoff + request.url, {
          encoding: 'utf8',
          flag: 'r',
        })
      )
    }
  })
  .listen(3000, 'localhost')
