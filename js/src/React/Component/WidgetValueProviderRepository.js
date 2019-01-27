/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

/**
 * Installs providers to allow fetching widget values from their rendered native DOM elements
 *
 * @author Dan Phillimore <dan@ovms.co>
 */
export default class WidgetValueProviderRepository {
    constructor () {
        /**
         * @type {Object.<string, HTMLElement>}
         */
        this.widgetElements = {};
        /**
         * @type {object[]}
         * @see addProvider
         */
        this.widgetValueProviders = [];
    }

    /**
     * Adds a provider for a specific value of a widget definition.
     * The callback will be passed the native DOM element for the rendered widget,
     * and is expected to return the value for the widget "value".
     *
     * @param {string} libraryName
     * @param {string} widgetDefinitionName
     * @param {string} valueName
     * @param {Function} callback
     */
    addProvider (libraryName, widgetDefinitionName, valueName, callback) {
        this.widgetValueProviders.push({
            libraryName,
            widgetDefinitionName,
            valueName,
            callback
        });
    }

    /**
     * Stores a new rendered native DOM element for a rendered widget state,
     * or clears the stored element (eg. when the element becomes "absent")
     *
     * @param {string[]|number[]} widgetStatePath
     * @param {HTMLElement|null} element
     */
    setReferencedWidgetElement (widgetStatePath, element) {
        this.widgetElements[widgetStatePath.join('-')] = element;
    }

    /**
     * Bridges the native value providers installed by plugins to Combyna's value provider API.
     * This must be called as part of bootstrapping in order for widget values to be fetchable
     *
     * @param {ClientFactory} clientFactory
     */
    installProviders (clientFactory) {
        this.widgetValueProviders.forEach(({libraryName, widgetDefinitionName, valueName, callback}) => {
            clientFactory.addWidgetValueProvider(
                libraryName,
                widgetDefinitionName,
                valueName,
                (widgetStatePath) => {
                    const widgetStateID = widgetStatePath.join('-');
                    const widgetElement = this.widgetElements[widgetStateID];

                    if (!widgetElement) {
                        throw new Error(`No element set for widget state "${widgetStateID}"`);
                    }

                    return callback(widgetElement);
                }
            );
        });
    }
}
