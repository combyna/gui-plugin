/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

export default class ReactElementFactoryRepository {
    /**
     * @param {TriggerMappingRepository} builtinTriggerMappingRepository
     */
    constructor (builtinTriggerMappingRepository) {
        /**
         * @type {TriggerMappingRepository}
         */
        this.builtinTriggerMappingRepository = builtinTriggerMappingRepository;
        /**
         * Library names to React element factory functions
         *
         * @type {Object.<string,{}>}
         */
        this.libraries = {};
    }

    /**
     * Adds a new factory that creates React elements
     *
     * @param {string} libraryName
     * @param {string} widgetDefinitionName
     * @param {Function} elementFactory
     */
    addFactory (
        libraryName,
        widgetDefinitionName,
        elementFactory
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.libraries, libraryName)) {
            this.libraries[libraryName] = {};
        }

        this.libraries[libraryName][widgetDefinitionName] = elementFactory;
    }

    /**
     * Fetches the factory that creates a React element for the specified widget
     *
     * @param {string} libraryName
     * @param {string} widgetDefinitionName
     * @returns {Function}
     */
    getFactory (
        libraryName,
        widgetDefinitionName
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.libraries, libraryName)) {
            throw new Error(`Library "${libraryName}" not defined`);
        }

        if (!Object.prototype.hasOwnProperty.call(this.libraries[libraryName], widgetDefinitionName)) {
            throw new Error(`Widget definition "${widgetDefinitionName}" not defined`);
        }

        return this.libraries[libraryName][widgetDefinitionName](this.builtinTriggerMappingRepository);
    }
}
