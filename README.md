# mrk

[![bitHound Code](https://www.bithound.io/github/alekzonder/mrk/badges/code.svg)](https://www.bithound.io/github/alekzonder/mrk)
[![bitHound Overall Score](https://www.bithound.io/github/alekzonder/mrk/badges/score.svg)](https://www.bithound.io/github/alekzonder/mrk)
[![bitHound Dependencies](https://www.bithound.io/github/alekzonder/mrk/badges/dependencies.svg)](https://www.bithound.io/github/alekzonder/mrk/master/dependencies/npm)

[![NPM](https://nodei.co/npm/mrk.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mrk/)

simple markdown server

can render and upload your docs to webdav

powered with [markdown-it](https://github.com/markdown-it/markdown-it)

styles from [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)

highlight code with [highlight.js](https://highlightjs.org/)

![img](docs/screenshot.png)

# install

```
npm install -g mrk@latest
```

# usage

## start

alias: s

- start markdown server on 3334 port for all network interfaces
- watch all .md files in current work directory
- recompile .md on change

open in browser http://localhost:3334

```
mrk

# OR

mrk start

# OR

mrk s
```

## render [work dir]

alias: r

render all .md files in current work directory to ./www_md directory

### options

`--footer <filepath>` - set your custom footer with analytics or js
`--raw` - render without header and footer

## clean

alias: c

clean all rendered files

## upload <webdav-url>

alias: up

upload rendered files to webdav

```
mrk upload http://example.com/docs/
```

# LICENSE

MIT
