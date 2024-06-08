declare module "updater" {
    export default updater;
    export type Platform = {
        /**
         * - The URL to the package
         */
        url: string;
        /**
         * - The path to the executable
         */
        execPath: string;
    };
    export type Packages = {
        /**
         * - The Windows package
         */
        win: Platform;
        /**
         * - The macOS package
         */
        mac: Platform;
        /**
         * - The Linux 32-bit package
         */
        linux32: Platform;
        /**
         * - The Linux 64-bit package
         */
        linux64: Platform;
    };
    export type Manifest = {
        /**
         * - The name of the application
         */
        name: string;
        /**
         * - The current version of the application
         */
        version: string;
        /**
         * - The URL to the remote manifest file
         */
        manifestUrl: string;
        /**
         * - The packages for the application
         */
        packages: Packages;
    };
    export type UpdaterOptions = {
        /**
         * - The path to a directory to download the updates to and unpack them in. Defaults to [`os.tmpdir()`](https://nodejs.org/api/os.html#os_os_tmpdir)
         */
        temporaryDirectory: string;
    };
    /**
     * @typedef {object} Platform
     * @property {string} url - The URL to the package
     * @property {string} execPath - The path to the executable
     */
    /**
     * @typedef {object} Packages
     * @property {Platform} win - The Windows package
     * @property {Platform} mac - The macOS package
     * @property {Platform} linux32 - The Linux 32-bit package
     * @property {Platform} linux64 - The Linux 64-bit package
     */
    /**
     * @typedef {object} Manifest
     * @property {string} name - The name of the application
     * @property {string} version - The current version of the application
     * @property {string} manifestUrl - The URL to the remote manifest file
     * @property {Packages} packages - The packages for the application
     */
    /**
     * @typedef {object} UpdaterOptions
     * @property {string} temporaryDirectory - The path to a directory to download the updates to and unpack them in. Defaults to [`os.tmpdir()`](https://nodejs.org/api/os.html#os_os_tmpdir)
     */
    class updater {
        /**
         * Creates new instance of updater.
         *
         * @constructor
         * @param {Manifest} manifest - See the [manifest schema](https://github.com/nwutils/nw-updater?tab=readme-ov-file#manifest-schema).
         * @param {UpdaterOptions} options - Optional
         */
        constructor(manifest: Manifest, options: UpdaterOptions);
        manifest: Manifest;
        options: {
            temporaryDirectory: any;
        };
        /**
         * Check the latest available version of the application by requesting the manifest specified in `manifestUrl`.
         *
         * @async
         * @method
         * @returns {Promise.<boolean>}
         */
        checkNewVersion(): Promise<boolean>;
        /**
           * Downloads the new app to a template folder
           * @param  {Function} cb - called when download completes. Callback arguments: error, downloaded filepath
           * @param  {Manifest} newManifest - see [manifest schema](#manifest-schema) below
           * @return {Request} Request - stream, the stream contains `manifest` property with new manifest and 'content-length' property with the size of package.
           */
        download(cb: Function, newManifest: Manifest): Request;
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
