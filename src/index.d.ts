declare module "updater" {
    export default updater;
    /**
     * Creates new instance of updater. Manifest could be a `package.json` of project.
     *
     * Note that compressed apps are assumed to be downloaded in the format produced by [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) (or [grunt-node-webkit-builder](https://github.com/mllrsohn/grunt-node-webkit-builder)).
     *
     * @constructor
     * @param {object} manifest - See the [manifest schema](#manifest-schema) below.
     * @param {object} options - Optional
     * @property {string} options.temporaryDirectory - (Optional) path to a directory to download the updates to and unpack them in. Defaults to [`os.tmpdir()`](https://nodejs.org/api/os.html#os_os_tmpdir)
     */
    class updater {
        constructor(manifest: any, options: any);
        manifest: any;
        options: {
            temporaryDirectory: any;
        };
        /**
           * Will check the latest available version of the application by requesting the manifest specified in `manifestUrl`.
           *
           * The callback will always be called; the second parameter indicates whether or not there's a newer version.
           * This function assumes you use [Semantic Versioning](http://semver.org) and enforces it; if your local version is `0.2.0` and the remote one is `0.1.23456` then the callback will be called with `false` as the second paramter. If on the off chance you don't use semantic versioning, you could manually download the remote manifest and call `download` if you're happy that the remote version is newer.
           *
           * @param {function} cb - Callback arguments: error, newerVersionExists (`Boolean`), remoteManifest
           */
        checkNewVersion(cb: Function): void;
        /**
           * Downloads the new app to a template folder
           * @param  {Function} cb - called when download completes. Callback arguments: error, downloaded filepath
           * @param  {Object} newManifest - see [manifest schema](#manifest-schema) below
           * @return {Request} Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.
           */
        download(cb: Function, newManifest: any): Request;
        /**
           * Returns executed application path
           * @returns {string}
           */
        getAppPath(): string;
        /**
           * Returns current application executable
           * @returns {string}
           */
        getAppExec(): string;
        /**
           * Will unpack the `filename` in temporary folder.
           * For Windows, [unzip](https://www.mkssoftware.com/docs/man1/unzip.1.asp) is used (which is [not signed](https://github.com/edjafarov/node-webkit-updater/issues/68)).
           *
           * @param {string} filename
           * @param {function} cb - Callback arguments: error, unpacked directory
           * @param {object} manifest
           */
        unpack(filename: string, cb: Function, manifest: object): void;
        /**
           * Runs installer
           * @param {string} appPath
           * @param {array} args - Arguments which will be passed when running the new app
           * @param {object} options - Optional
           * @returns {function}
           */
        runInstaller(appPath: string, args: any[], options: object, ...args: any[]): Function;
        /**
           * Installs the app (copies current application to `copyPath`)
           * @param {string} copyPath
           * @param {function} cb - Callback arguments: error
           */
        install(copyPath: string, cb: Function, ...args: any[]): void;
        /**
           * Runs the app from original app executable path.
           * @param {string} execPath
           * @param {array} args - Arguments passed to the app being ran.
           * @param {object} options - Optional. See `spawn` from nodejs docs.
           *
           * Note: if this doesn't work, try `gui.Shell.openItem(execPath)` (see [node-webkit Shell](https://github.com/rogerwang/node-webkit/wiki/Shell)).
           */
        run(execPath: string, args: any[], options: object, ...args: any[]): void;
    }
}
