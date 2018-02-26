export default class ComponentRepository {
    /**
     * @param {string[]} libraryNames
     */
    constructor (
        libraryNames = []
    ) {
        /**
         * Library names to primitive widget definition React components
         * @type {Object.<string,{}>}
         */
        this.libraries = libraryNames.reduce((libraries, libraryName) => {
            libraries[libraryName] = {};
            return libraries;
        }, {});
    }

    /**
     * Add component
     * @param {string} libraryName
     * @param {string} widgetDefinitionName
     * @param {React.Component|Function} component
     */
    addComponent (
        libraryName,
        widgetDefinitionName,
        component
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.libraries, libraryName)) {
            throw new Error(`Library "${libraryName}" not defined`);
        }

        this.libraries[libraryName][widgetDefinitionName] = component;
    }

    /**
     * Get component
     * @param {string} libraryName
     * @param {string} widgetDefinitionName
     */
    getComponent (
        libraryName,
        widgetDefinitionName
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.libraries, libraryName)) {
            throw new Error(`Library "${libraryName}" not defined`);
        }

        if (!Object.prototype.hasOwnProperty.call(this.libraries[libraryName], widgetDefinitionName)) {
            throw new Error(`WidgetDefinition  "${widgetDefinitionName}" not defined`);
        }

        return this.libraries[libraryName][widgetDefinitionName];
    }
}
