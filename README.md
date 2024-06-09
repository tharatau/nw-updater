> This repository is in maintainance mode. Bug fixes will be provided on a best effort basis. If you use this project, please consider contributing back.

# @nwutils/updater

[![npm](https://img.shields.io/npm/v/node-webkit-updater.svg?style=flat)](https://www.npmjs.com/package/node-webkit-updater)
[![Join the chat at https://gitter.im/nwjs/nwjs](https://badges.gitter.im/nwjs/nwjs.svg)](https://gitter.im/nwjs/nwjs)

```shell
npm i @nwutils/updater
```

It gives you low-level API to:

1. Check the manifest for version (from your running "old" app).
2. If the version is different from the running one, download new package to a temp directory.
3. Unpack the package in temp.
4. Run new app from temp and kill the old one (i.e. still all from the running app).
5. The new app (in temp) will copy itself to the original folder, overwriting the old app.
6. The new app will run itself from original folder and exit the process.

You should build this logic by yourself though. As a reference you can use [example](app/index.html).

Covered by tests and works for [linux](http://screencast.com/t/Je2ptbHhP), [windows](http://screencast.com/t/MSTKqVS3) and [mac](http://screencast.com/t/OXyC5xoA).

## Examples

- [Basic](examples/basic.js)


## API

<a name="new_updater"></a>
#### new updater(manifest, options)
Creates new instance of updater. Manifest could be a `package.json` of project.

Note that compressed apps are assumed to be downloaded in the format produced by [nw-builder](https://github.com/nwutils/nw-builder) (or [grunt-nw-builder](https://github.com/nwjs/grunt-nw-builder)).

**Params**

- manifest `object` - See the [manifest schema](#manifest-schema) below.  
- options `object` - Optional  

<a name="updater#checkNewVersion"></a>
#### updater.checkNewVersion(cb)
Will check the latest available version of the application by requesting the manifest specified in `manifestUrl`.

The callback will always be called; the second parameter indicates whether or not there's a newer version.
This function assumes you use [Semantic Versioning](http://semver.org) and enforces it; if your local version is `0.2.0` and the remote one is `0.1.23456` then the callback will be called with `false` as the second paramter. If on the off chance you don't use semantic versioning, you could manually download the remote manifest and call `download` if you're happy that the remote version is newer.

**Params**

- cb `function` - Callback arguments: error, newerVersionExists (`Boolean`), remoteManifest  

<a name="updater#download"></a>
#### updater.download(cb, newManifest)
Downloads the new app to a template folder

**Params**

- cb `function` - called when download completes. Callback arguments: error, downloaded filepath  
- newManifest `Object` - see [manifest schema](#manifest-schema) below  

**Returns**: `Request` - Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.  
<a name="updater#getAppPath"></a>
#### updater.getAppPath()
Returns executed application path

**Returns**: `string`  
<a name="updater#getAppExec"></a>
#### updater.getAppExec()
Returns current application executable

**Returns**: `string`  
<a name="updater#unpack"></a>
#### updater.unpack(filename, cb, manifest)
Will unpack the `filename` in temporary folder.
For Windows, [unzip](https://www.mkssoftware.com/docs/man1/unzip.1.asp) is used (which is [not signed](https://github.com/edjafarov/node-webkit-updater/issues/68)).

**Params**

- filename `string`  
- cb `function` - Callback arguments: error, unpacked directory  
- manifest `object`  

<a name="updater#runInstaller"></a>
#### updater.runInstaller(appPath, args, options)
Runs installer

**Params**

- appPath `string`  
- args `array` - Arguments which will be passed when running the new app  
- options `object` - Optional  

**Returns**: `function`  
<a name="updater#install"></a>
#### updater.install(copyPath, cb)
Installs the app (copies current application to `copyPath`)

**Params**

- copyPath `string`  
- cb `function` - Callback arguments: error  

<a name="updater#run"></a>
#### updater.run(execPath, args, options)
Runs the app from original app executable path.

**Params**

- execPath `string`  
- args `array` - Arguments passed to the app being ran.  
- options `object` - Optional. See `spawn` from nodejs docs.

Note: if this doesn't work, try `gui.Shell.openItem(execPath)` (see [node-webkit Shell](https://github.com/rogerwang/node-webkit/wiki/Shell)).  


---

## Manifest Schema

An example manifest:

```json
{
    "name": "updapp",
    "version": "0.0.2",
    "author": "Eldar Djafarov <djkojb@gmail.com>",
    "manifestUrl": "http://localhost:3000/package.json",
    "packages": {
        "mac": {
           "url": "http://localhost:3000/releases/updapp/mac/updapp.zip"
        },
        "win": {
           "url": "http://localhost:3000/releases/updapp/win/updapp.zip"
        },
        "linux32": {
           "url": "http://localhost:3000/releases/updapp/linux32/updapp.tar.gz"
        }
    }
}
```

The manifest could be a `package.json` of project, but doesn't have to be.

### manifest.name

The name of your app. From time, it is assumed your Mac app is called `<manifest.name>.app`, your Windows executable is `<manifest.name>.exe`, etc.

### manifest.version
[semver](http://semver.org) version of your app.

### manifest.manifestUrl
The URL where your latest manifest is hosted; where node-webkit-updater looks to check if there is a newer version of your app available.

### manifest.packages
An "object" containing an object for each OS your app (at least this version of your app) supports; `mac`, `win`, `linux32`, `linux64`.

### manifest.packages.{mac, win, linux32, linux64}.url
Each package has to contain a `url` property pointing to where the app (for the version & OS in question) can be downloaded.

### manifest.packages.{mac, win, linux32, linux64}.execPath (Optional)
It's assumed your app is stored at the root of your package, use this to override that and specify a path (relative to the root of your package).

This can also be used to override `manifest.name`; e.g. if your `manifest.name` is `helloWorld` (therefore `helloWorld.app` on Mac) but your Windows executable is named `nw.exe`. Then you'd set `execPath` to `nw.exe`

---

## Troubleshooting

### Mac
If you get an error on Mac about too many files being open, run `ulimit -n 10240`

### Windows
On Windows, there is no "unzip" command built in by default. As a result, this project uses a third party "unzip.exe" in order to extract the downloaded update. On the NWJS site, in the "How to package and distribute your apps" file, one of the recommended methods of distribution is using EnigmaVirtualBox to package the app, nw.exe, and required DLLs into a single EXE file. This method works great for distribution, but unfortunately breaks node-webkit-updater, because it wraps the required unzip.exe file inside of the created EnigmaVirtualBox EXE. As a result, *it is not possible to use EnigmaVirtualBox to distribute your app if you plan on using node-webkit-updater*. Try using InnoSetup instead.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
