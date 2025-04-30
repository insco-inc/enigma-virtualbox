# @insco/enigma-virtualbox

[![Test](https://github.com/insco-inc/enigma-virtualbox/actions/workflows/test.yml/badge.svg)](https://github.com/insco-inc/enigma-virtualbox/actions/workflows/test.yml)
[![Publish](https://github.com/insco-inc/enigma-virtualbox/actions/workflows/publish.yml/badge.svg)](https://github.com/insco-inc/enigma-virtualbox/actions/workflows/publish.yml)
[![NPM Version](https://img.shields.io/npm/v/%40insco%2Fenigma-virtualbox)](https://www.npmjs.com/package/@insco/enigma-virtualbox)

## Install

```bash
npm i @insco/enigma-virtualbox
```

## Usage

```powershell
# Basic
enigmavirtualbox generate . --input origin.exe --output origin_boxed.exe

# Advanced
enigmavirtualbox generate . `
    --input "$pwd\origin.exe" `
    --output "$pwd\origin_boxed.exe" `
    --exclude **/origin.exe `
    --templatePath.project templates/project.template.hbs `
    --evbOptions.compressFiles False `
    --evbOptions.deleteExtractedOnExit False
```

## Template Options

| Options                        |              Values              |
|:-------------------------------|:--------------------------------:|
| project                        | `templates/project.template.hbs` |
| dir                            |   `templates/dir.template.hbs`   |
| file                           |  `templates/file.template.hbs`   |

## EVB Options

| Options                         |      Values       |
|:--------------------------------|:-----------------:|
| deleteExtractedOnExit           | <`True`, `False`> |
| compressFiles                   | <`True`, `False`> |
| shareVirtualSystem              | <`True`, `False`> |
| mapExecutableWithTemporaryFile  | <`True`, `False`> |
| allowRunningOfVirtualExeFiles   | <`True`, `False`> |
| processesOfAnyPlatforms         | <`True`, `False`> |

## Debug

```bash
npx @insco/enigma-virtualbox -h
```

## License

[MIT](./LICENSE)
